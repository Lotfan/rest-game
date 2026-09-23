// The whole game brain. It is one "reducer": a function that takes the current
// game state + an action ("BAKE", "SERVE"...) and returns the new state.
import {
  RECIPES, DECOR, SEATS, BATCH, STOCK_MAX, OVEN_COSTS, START_OVENS, START_COINS,
  START_RECIPES, START_EQUIPPED, CUSTOMERS,
} from './data.js';

export const recipeById = (id) => RECIPES.find((r) => r.id === id);
export const decorById = (id) => DECOR.find((d) => d.id === id);

export const xpNeeded = (level) => 30 + 20 * level;

export const cozyScore = (equipped) =>
  Object.values(equipped).reduce((sum, id) => sum + (decorById(id)?.cozy || 0), 0);

const capCozy = (equipped) => Math.min(cozyScore(equipped), 60);
export const spawnDelay = (equipped) => 13000 * (1 - capCozy(equipped) / 100);
export const tipMultiplier = (equipped) => 1 + capCozy(equipped) / 40;
export const patienceFor = (equipped, items) => 25000 + items * 10000 + capCozy(equipped) * 300;

export const nextOvenCost = (ovenCount) => {
  const i = ovenCount - START_OVENS;
  return i >= 0 && i < OVEN_COSTS.length ? OVEN_COSTS[i] : null;
};

export function initialState() {
  return {
    loaded: false,
    coins: START_COINS,
    xp: 0,
    level: 1,
    totalServed: 0,
    recipes: [...START_RECIPES],
    ovens: Array.from({ length: START_OVENS }, () => null),
    stock: {},
    owned: DECOR.filter((d) => d.cost === 0).map((d) => d.id),
    equipped: { ...START_EQUIPPED },
    bg: null,
    customers: [],
    spawnIn: 1500,
    lastTick: Date.now(),
    toast: null,
    nextId: 1,
    seenHelp: false,
  };
}

// The parts of the state that get saved to the phone.
export const SAVE_KEYS = [
  'coins', 'xp', 'level', 'totalServed', 'recipes', 'ovens', 'stock', 'owned', 'equipped', 'bg', 'seenHelp',
];

const toast = (state, text, now = Date.now()) => ({ ...state, toast: { id: state.nextId, text, until: now + 2200 }, nextId: state.nextId + 1 });

function addXp(state, amount) {
  let { xp, level, coins } = state;
  xp += amount;
  let leveled = false;
  while (xp >= xpNeeded(level)) {
    xp -= xpNeeded(level);
    level += 1;
    coins += level * 20;
    leveled = true;
  }
  let next = { ...state, xp, level, coins };
  if (leveled) next = toast(next, `Level ${level}! Bonus +${level * 20} 🪙`);
  return next;
}

function makeCustomer(state) {
  const taken = state.customers.map((c) => c.seat);
  const free = [];
  for (let s = 0; s < SEATS; s++) if (!taken.includes(s)) free.push(s);
  if (free.length === 0) return state;
  const seat = free[Math.floor(Math.random() * free.length)];

  const maxItems = state.level >= 6 ? 3 : state.level >= 3 ? 2 : 1;
  const count = 1 + Math.floor(Math.random() * maxItems);
  const order = [];
  for (let i = 0; i < count; i++) {
    const id = state.recipes[Math.floor(Math.random() * state.recipes.length)];
    order.push({ id, done: false });
  }
  const patienceMax = patienceFor(state.equipped, count);
  const customer = {
    id: state.nextId,
    seat,
    emoji: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
    skin: Math.floor(Math.random() * 1000),
    order,
    patience: patienceMax,
    patienceMax,
  };
  return { ...state, customers: [...state.customers, customer], nextId: state.nextId + 1 };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'LOAD': {
      const base = initialState();
      const saved = action.saved || {};
      const merged = { ...base };
      for (const k of SAVE_KEYS) if (saved[k] !== undefined) merged[k] = saved[k];
      // Make sure new decor slots / ovens from a save always look valid.
      merged.equipped = { ...START_EQUIPPED, ...merged.equipped };
      merged.stock = { ...merged.stock };
      return { ...merged, loaded: true, lastTick: Date.now() };
    }

    case 'TICK': {
      const { now, playing } = action;
      const delta = Math.max(0, Math.min(now - state.lastTick, 1500));
      let s = { ...state, lastTick: now };

      if (s.toast && now > s.toast.until) s.toast = null;

      // Ovens use real time, so baking carries on while you're on another tab or away.
      let ovensChanged = false;
      const stock = { ...s.stock };
      const ovens = s.ovens.map((o) => {
        if (o && now >= o.doneAt) {
          stock[o.recipeId] = Math.min(STOCK_MAX, (stock[o.recipeId] || 0) + BATCH);
          ovensChanged = true;
          return null;
        }
        return o;
      });
      if (ovensChanged) { s.ovens = ovens; s.stock = stock; }

      // Customers only wait and arrive while you're on the Cafe tab.
      if (playing && s.recipes.length > 0) {
        let left = 0;
        const remaining = [];
        for (const c of s.customers) {
          const p = c.patience - delta;
          if (p <= 0) left += 1; else remaining.push({ ...c, patience: p });
        }
        s.customers = remaining;
        if (left > 0) s = toast(s, left === 1 ? '😿 A customer left' : `😿 ${left} customers left`, now);

        s.spawnIn = s.spawnIn - delta;
        if (s.customers.length === 0) s.spawnIn = Math.min(s.spawnIn, 3000);
        if (s.spawnIn <= 0) {
          if (s.customers.length < SEATS) {
            s = makeCustomer(s);
            const base = spawnDelay(s.equipped);
            s.spawnIn = base * (0.7 + Math.random() * 0.6);
          } else {
            s.spawnIn = 1000;
          }
        }
      }
      return s;
    }

    case 'BAKE': {
      const r = recipeById(action.recipeId);
      if (!r || !state.recipes.includes(r.id)) return state;
      if ((state.stock[r.id] || 0) >= STOCK_MAX) return toast(state, `Counter is full of ${r.name}`);
      const slot = state.ovens.findIndex((o) => o === null);
      if (slot === -1) return toast(state, 'All ovens are busy');
      const ovens = [...state.ovens];
      ovens[slot] = { recipeId: r.id, doneAt: action.now + r.bakeSec * 1000, startedAt: action.now };
      return { ...state, ovens };
    }

    case 'SERVE': {
      const c = state.customers.find((x) => x.id === action.customerId);
      if (!c) return state;
      const item = c.order[action.itemIndex];
      if (!item || item.done) return state;
      if ((state.stock[item.id] || 0) < 1) return toast(state, `No ${recipeById(item.id).name} on the counter`);

      const stock = { ...state.stock, [item.id]: state.stock[item.id] - 1 };
      const order = c.order.map((o, i) => (i === action.itemIndex ? { ...o, done: true } : o));
      let s = { ...state, stock };

      if (order.every((o) => o.done)) {
        const total = order.reduce((sum, o) => sum + recipeById(o.id).price, 0);
        const tip = Math.ceil(total * 0.25 * (c.patience / c.patienceMax) * tipMultiplier(state.equipped));
        s.customers = s.customers.filter((x) => x.id !== c.id);
        s.coins += total + tip;
        s.totalServed += 1;
        s = toast(s, `+${total + tip} 🪙  (tip ${tip})`);
        s = addXp(s, order.length * 5 + 2);
      } else {
        s.customers = s.customers.map((x) => (x.id === c.id ? { ...x, order } : x));
      }
      return s;
    }

    case 'BUY_RECIPE': {
      const r = recipeById(action.id);
      if (!r || state.recipes.includes(r.id)) return state;
      if (state.level < r.level) return toast(state, `Reach level ${r.level} first`);
      if (state.coins < r.cost) return toast(state, 'Not enough coins');
      return toast({ ...state, coins: state.coins - r.cost, recipes: [...state.recipes, r.id] }, `Learned ${r.name}!`);
    }

    case 'BUY_OVEN': {
      const cost = nextOvenCost(state.ovens.length);
      if (cost === null) return state;
      if (state.coins < cost) return toast(state, 'Not enough coins');
      return toast({ ...state, coins: state.coins - cost, ovens: [...state.ovens, null] }, 'New oven added! 🔥');
    }

    case 'BUY_DECOR': {
      const d = decorById(action.id);
      if (!d || state.owned.includes(d.id)) return state;
      if (state.coins < d.cost) return toast(state, 'Not enough coins');
      return toast(
        { ...state, coins: state.coins - d.cost, owned: [...state.owned, d.id], equipped: { ...state.equipped, [d.slot]: d.id } },
        `${d.name} added ✨`,
      );
    }

    case 'EQUIP': {
      const d = decorById(action.id);
      if (!d || !state.owned.includes(d.id)) return state;
      return { ...state, equipped: { ...state.equipped, [d.slot]: d.id } };
    }

    case 'SET_BG':
      return { ...state, bg: action.id };

    case 'DISMISS_HELP':
      return { ...state, seenHelp: true };

    case 'RESET':
      return { ...initialState(), loaded: true, seenHelp: true };

    default:
      return state;
  }
}