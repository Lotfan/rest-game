// All the game content lives here: recipes, decorations, customers.
// Want a new recipe or decoration? Add one line to the lists below.

export const START_COINS = 40;
export const SEATS = 4;
export const BATCH = 2;        // items you get from one bake
export const STOCK_MAX = 8;    // max of each item on the counter

// bakeSec = seconds to bake, price = coins per item when served
export const RECIPES = [
  { id: 'black',    name: 'Black Coffee',    emoji: '☕', price: 5,  bakeSec: 5,  level: 1, cost: 0 },
  { id: 'iced',     name: 'Iced Coffee',     emoji: '🧊', price: 7,  bakeSec: 6,  level: 1, cost: 0 },
  { id: 'tea',      name: 'Green Tea',       emoji: '🍵', price: 6,  bakeSec: 6,  level: 2, cost: 40 },
  { id: 'chamolie', name: 'Chamomile Tea',   emoji: '🌼', price: 8,  bakeSec: 8,  level: 2, cost: 55 },
  { id: 'flower',   name: 'Flower Tea',      emoji: '🌸', price: 11, bakeSec: 10, level: 3, cost: 90 },
  { id: 'straw',    name: 'Strawberry Drink',emoji: '🍓', price: 15, bakeSec: 12, level: 4, cost: 140 },
  { id: 'latte',    name: 'Latte',           emoji: '🥛', price: 20, bakeSec: 15, level: 5, cost: 210 },
  { id: 'icedmact', name: 'Iced Matcha',     emoji: '🍹', price: 26, bakeSec: 18, level: 6, cost: 310 },
];

export const START_RECIPES = ['black', 'iced'];

// Cost to add oven number 3, 4, 5, 6 (you start with 2)
export const OVEN_COSTS = [150, 200, 400, 800];
export const START_OVENS = 3;

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