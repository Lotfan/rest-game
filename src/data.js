// All the game content lives here: recipes, decorations, customers.
// Want a new recipe or decoration? Add one line to the lists below.

export const START_COINS = 40;
export const SEATS = 4;
export const BATCH = 2;        // items you get from one bake
export const STOCK_MAX = 8;    // max of each item on the counter

// bakeSec = seconds to bake, price = coins per item when served
export const RECIPES = [
  { id: 'coffee',        name: 'Coffee',         emoji: '☕', price: 5,  bakeSec: 5,  level: 1,  cost: 0 },
  { id: 'croissant',     name: 'Croissant',      emoji: '🥐', price: 8,  bakeSec: 9,  level: 1,  cost: 0 },
  { id: 'cookie',        name: 'Cookie',         emoji: '🍪', price: 7,  bakeSec: 8,  level: 2,  cost: 30 },
  { id: 'tea',           name: 'Green Tea',      emoji: '🍵', price: 6,  bakeSec: 6,  level: 2,  cost: 40 },
  { id: 'onigiri',       name: 'Onigiri',        emoji: '🍙', price: 10, bakeSec: 10, level: 3,  cost: 60 },
  { id: 'cupcake',       name: 'Cupcake',        emoji: '🧁', price: 12, bakeSec: 12, level: 3,  cost: 80 },
  { id: 'donut',         name: 'Donut',          emoji: '🍩', price: 14, bakeSec: 14, level: 4,  cost: 110 },
  { id: 'agedashitofu',  name: 'Agedashi Tofu',  emoji: '🍢', price: 16, bakeSec: 15, level: 4,  cost: 130 },
  { id: 'noodles',       name: 'Noodles',        emoji: '🍝', price: 20, bakeSec: 18, level: 5,  cost: 160 },
  { id: 'cookieskillet', name: 'Cookie Skillet', emoji: '🍪', price: 24, bakeSec: 20, level: 5,  cost: 190 },
  { id: 'pie',           name: 'Apple Pie',      emoji: '🥧', price: 22, bakeSec: 22, level: 6,  cost: 230 },
  { id: 'cake',          name: 'Cake Slice',     emoji: '🍰', price: 28, bakeSec: 26, level: 6,  cost: 280 },
  { id: 'ramen',         name: 'Ramen',          emoji: '🍜', price: 32, bakeSec: 26, level: 7,  cost: 340 },
  { id: 'bentobox',      name: 'Bento Box',      emoji: '🍱', price: 38, bakeSec: 28, level: 8,  cost: 420 },
  { id: 'pancakes',      name: 'Pancakes',       emoji: '🥞', price: 34, bakeSec: 30, level: 8,  cost: 480 },
  { id: 'boba',          name: 'Bubble Tea',     emoji: '🧋', price: 40, bakeSec: 24, level: 9,  cost: 560 },
  { id: 'mooncake',      name: 'Mooncake',       emoji: '🥮', price: 46, bakeSec: 30, level: 9,  cost: 650 },
  { id: 'bday',          name: 'Party Cake',     emoji: '🎂', price: 60, bakeSec: 40, level: 10, cost: 850 },
];

export const START_RECIPES = ['coffee', 'croissant'];

// Cost to add oven number 3, 4, 5, 6 (you start with 2)
export const OVEN_COSTS = [150, 400, 900, 1800];
export const START_OVENS = 2;

// Slots are the places you can decorate. kind 'color' = a colour, 'emoji' = a little picture.
// cozy = how much the item adds to your Cozy score. A higher Cozy score means
// customers arrive faster, wait longer and tip more.
export const SLOTS = [
  { id: 'wall',    name: 'Walls',       kind: 'color' },
  { id: 'floor',   name: 'Floor',       kind: 'color' },
  { id: 'table',   name: 'Tablecloths', kind: 'color' },
  { id: 'window',  name: 'Window',      kind: 'emoji' },
  { id: 'art',     name: 'Wall art',    kind: 'emoji' },
  { id: 'lights',  name: 'Lights',      kind: 'emoji' },
  { id: 'plant',   name: 'Plants',      kind: 'emoji' },
  { id: 'counter', name: 'Counter',     kind: 'emoji' },
];

export const DECOR = [
  // walls (first item of each slot is free and owned from the start)
  { id: 'wall_milk',     slot: 'wall', name: 'Milk',         color: '#FFEFE8', cost: 0,   cozy: 0 },
  { id: 'wall_pink',     slot: 'wall', name: 'Strawberry',   color: '#FFD3E0', cost: 40,  cozy: 2 },
  { id: 'wall_mint',     slot: 'wall', name: 'Pistachio',    color: '#D9EEC8', cost: 40,  cozy: 2 },
  { id: 'wall_sky',      slot: 'wall', name: 'Blueberry',    color: '#CFE3F7', cost: 70,  cozy: 3 },
  { id: 'wall_lilac',    slot: 'wall', name: 'Lavender',     color: '#E4D6F5', cost: 90,  cozy: 4 },
  { id: 'wall_butter',   slot: 'wall', name: 'Butter',       color: '#FFF0B3', cost: 90,  cozy: 4 },
  // floors
  { id: 'floor_wood',    slot: 'floor', name: 'Oak',         color: '#D9A877', cost: 0,   cozy: 0 },
  { id: 'floor_cocoa',   slot: 'floor', name: 'Cocoa',       color: '#A9714C', cost: 60,  cozy: 2 },
  { id: 'floor_pink',    slot: 'floor', name: 'Pink tiles',  color: '#F4B6C6', cost: 100, cozy: 3 },
  { id: 'floor_sage',    slot: 'floor', name: 'Sage tiles',  color: '#A9CFA0', cost: 140, cozy: 4 },
  { id: 'floor_slate',   slot: 'floor', name: 'Slate',       color: '#8F8AA8', cost: 180, cozy: 5 },
  // tablecloths
  { id: 'table_plain',   slot: 'table', name: 'Plain',       color: '#FFFFFF', cost: 0,   cozy: 0 },
  { id: 'table_red',     slot: 'table', name: 'Cherry',      color: '#F27C8E', cost: 35,  cozy: 2 },
  { id: 'table_mint',    slot: 'table', name: 'Mint',        color: '#9EDDC0', cost: 55,  cozy: 3 },
  { id: 'table_lilac',   slot: 'table', name: 'Lilac',       color: '#C8AEF0', cost: 80,  cozy: 4 },
  { id: 'table_sun',     slot: 'table', name: 'Sunshine',    color: '#FFD45E', cost: 110, cozy: 5 },
  // windows
  { id: 'window_none',   slot: 'window', name: 'None',       emoji: '', cost: 0,    cozy: 0, none: true },
  { id: 'window_a',      slot: 'window', name: 'Window',     emoji: '🪟', cost: 50,  cozy: 3 },
  { id: 'window_b',      slot: 'window', name: 'Sunrise',    emoji: '🌅', cost: 130, cozy: 6 },
  { id: 'window_c',      slot: 'window', name: 'Rainy day',  emoji: '🌧️', cost: 220, cozy: 9 },
  // wall art
  { id: 'art_none',      slot: 'art', name: 'None',          emoji: '', cost: 0,    cozy: 0, none: true },
  { id: 'art_a',         slot: 'art', name: 'Painting',      emoji: '🖼️', cost: 40,  cozy: 2 },
  { id: 'art_b',         slot: 'art', name: 'Clock',         emoji: '🕰️', cost: 70,  cozy: 3 },
  { id: 'art_c',         slot: 'art', name: 'Palette',       emoji: '🎨', cost: 110, cozy: 4 },
  { id: 'art_d',         slot: 'art', name: 'Sunflower',     emoji: '🌻', cost: 160, cozy: 6 },
  // lights
  { id: 'lights_none',   slot: 'lights', name: 'None',       emoji: '', cost: 0,    cozy: 0, none: true },
  { id: 'lights_a',      slot: 'lights', name: 'Lanterns',   repeat: 5, emoji: '🏮', cost: 60,  cozy: 3 },
  { id: 'lights_b',      slot: 'lights', name: 'Fairy lights', repeat: 6, emoji: '✨', cost: 140, cozy: 6 },
  { id: 'lights_c',      slot: 'lights', name: 'Disco ball', repeat: 2, emoji: '🪩', cost: 300, cozy: 8 },
  // plants
  { id: 'plant_none',    slot: 'plant', name: 'None',        emoji: '', cost: 0,    cozy: 0, none: true },
  { id: 'plant_a',       slot: 'plant', name: 'Cactus',      emoji: '🌵', cost: 30,  cozy: 2 },
  { id: 'plant_b',       slot: 'plant', name: 'Fern',        emoji: '🪴', cost: 60,  cozy: 3 },
  { id: 'plant_c',       slot: 'plant', name: 'Tulips',      emoji: '🌷', cost: 100, cozy: 4 },
  { id: 'plant_d',       slot: 'plant', name: 'Cherry tree', emoji: '🌸', cost: 200, cozy: 7 },
  // counter
  { id: 'counter_none',  slot: 'counter', name: 'None',      emoji: '', cost: 0,    cozy: 0, none: true },
  { id: 'counter_a',     slot: 'counter', name: 'Candle',    emoji: '🕯️', cost: 40,  cozy: 2 },
  { id: 'counter_b',     slot: 'counter', name: 'Teddy',     emoji: '🧸', cost: 80,  cozy: 4 },
  { id: 'counter_c',     slot: 'counter', name: 'Flowers',   emoji: '💐', cost: 120, cozy: 5 },
  { id: 'counter_d',     slot: 'counter', name: 'Cafe cat',  emoji: '🐈', cost: 250, cozy: 9 },
];

export const START_EQUIPPED = {
  wall: 'wall_milk', floor: 'floor_wood', table: 'table_plain',
  window: 'window_none', art: 'art_none', lights: 'lights_none',
  plant: 'plant_none', counter: 'counter_none',
};

export const CUSTOMERS = ['🐱', '🐶', '🐰', '🐻', '🦊', '🐼', '🐸', '🐨', '🐷', '🐹', '🦉', '🐧'];