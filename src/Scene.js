// The picture of your cafe: walls, floor, decorations, tables, customers and the counter.
import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, ImageBackground, StyleSheet } from 'react-native';
import { C } from './theme.js';
import { SEATS } from './data.js';
import { RECIPES } from './data.js';
import { decorById } from './game.js';
import Food from './Food.js';
import Character from './Character.js';
import { SCENE_BACKGROUNDS } from './images.js';

const COUNTER_H = 50;

function Seat({ customer, cloth, stock, onServe }) {
  const pop = useRef(new Animated.Value(1)).current;
  const customerId = customer ? customer.id : null;

  useEffect(() => {
    if (customerId !== null) {
      pop.setValue(0.3);
      Animated.spring(pop, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    }
  }, [customerId, pop]);

  let barColor = C.good;
  let pct = 0;
  if (customer) {
    pct = Math.max(0, customer.patience / customer.patienceMax);
    barColor = pct > 0.5 ? C.good : pct > 0.25 ? '#F0A23C' : C.bad;
  }

  return (
    <View style={s.seat}>
      {customer ? (
        <Animated.View style={{ transform: [{ scale: pop }], alignItems: 'center', width: '100%' }}>
          <View style={s.bubble}>
            <View style={s.bubbleItems}>
              {customer.order.map((item, i) => {
                const have = (stock[item.id] || 0) > 0;
                return (
                  <Pressable
                    key={i}
                    disabled={item.done}
                    onPress={() => onServe(customer.id, i)}
                    style={[s.item, have && !item.done && s.itemReady, item.done && s.itemDone]}
                  >
                    {item.done ? <Text style={s.itemEmoji}>✅</Text> : <Food id={item.id} size={26} />}
                  </Pressable>
                );
              })}
            </View>
            <View style={s.track}>
              <View style={[s.fill, { width: `${pct * 100}%`, backgroundColor: barColor }]} />
            </View>
          </View>
          <View style={s.customer}><Character customer={customer} size={56} /></View>
        </Animated.View>
      ) : (
        <View style={{ height: 0 }} />
      )}
      <View style={[s.table, { backgroundColor: cloth }]} />
    </View>
  );
}

export default function Scene({ equipped, customers = [], stock = {}, recipes = [], onServe, height, bg }) {
  const background = SCENE_BACKGROUNDS.find((b) => b.id === bg);
  const wall = decorById(equipped.wall)?.color;
  const floor = decorById(equipped.floor)?.color;
  const cloth = decorById(equipped.table)?.color;
  const win = decorById(equipped.window);
  const art = decorById(equipped.art);
  const lights = decorById(equipped.lights);
  const plant = decorById(equipped.plant);
  const counter = decorById(equipped.counter);

  const floorH = height * 0.42;
  const bySeat = {};
  customers.forEach((c) => { bySeat[c.seat] = c; });

  const stockChips = RECIPES.filter((r) => recipes.includes(r.id) && (stock[r.id] || 0) > 0);

  // A background image covers the whole scene, so the wall/floor colours step aside for it.
  const Wrap = background ? ImageBackground : View;
  const wrapProps = background
    ? { source: background.source, resizeMode: 'cover' }
    : { style: { backgroundColor: wall } };

  return (
    <Wrap {...wrapProps} style={[s.scene, { height }, wrapProps.style]}>
      {lights?.emoji ? (
        <View style={s.lights}>
          {Array.from({ length: lights.repeat || 1 }).map((_, i) => (
            <Text key={i} style={s.lightEmoji}>{lights.emoji}</Text>
          ))}
        </View>
      ) : null}
      {win?.emoji ? <Text style={[s.win, { top: 36 }]}>{win.emoji}</Text> : null}
      {art?.emoji ? <Text style={[s.art, { top: 44 }]}>{art.emoji}</Text> : null}

      {!background && <View style={[s.floor, { height: floorH, backgroundColor: floor }]} />}
      {plant?.emoji ? <Text style={[s.plant, { bottom: floorH - 8 }]}>{plant.emoji}</Text> : null}

      <View style={[s.seats, { bottom: COUNTER_H + 6 }]}>
        {Array.from({ length: SEATS }).map((_, i) => (
          <Seat key={i} customer={bySeat[i]} cloth={cloth} stock={stock} onServe={onServe} />
        ))}
      </View>

      {customers.length === 0 && onServe ? (
        <Text style={s.waiting}>Waiting for customers…</Text>
      ) : null}

      <View style={s.counter}>
        {counter?.emoji ? <Text style={s.counterEmoji}>{counter.emoji}</Text> : null}
        <View style={s.chips}>
          {stockChips.length === 0 && onServe ? <Text style={s.chipEmpty}>Counter is empty. Bake something!</Text> : null}
          {stockChips.map((r) => (
            <View key={r.id} style={s.chip}>
              <Food id={r.id} size={18} />
              <Text style={s.chipText}>{stock[r.id]}</Text>
            </View>
          ))}
        </View>
      </View>
    </Wrap>
  );
}

const s = StyleSheet.create({
  scene: { borderRadius: 24, overflow: 'hidden', borderWidth: 3, borderColor: C.white },
  lights: { position: 'absolute', top: 4, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around' },
  lightEmoji: { fontSize: 22 },
  win: { position: 'absolute', left: 22, fontSize: 64 },
  art: { position: 'absolute', right: 26, fontSize: 48 },
  floor: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 4, borderTopColor: 'rgba(74,36,64,0.12)' },
  plant: { position: 'absolute', right: 8, fontSize: 44 },
  seats: { position: 'absolute', left: 6, right: 6, flexDirection: 'row', alignItems: 'flex-end' },
  seat: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 3 },
  bubble: {
    backgroundColor: C.white, borderRadius: 16, paddingHorizontal: 4, paddingTop: 4, paddingBottom: 6,
    alignItems: 'center', borderWidth: 2, borderColor: C.line, minWidth: 48,
  },
  bubbleItems: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'nowrap' },
  item: { width: 30, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 10, opacity: 0.4 },
  itemReady: { opacity: 1, backgroundColor: C.blush },
  itemDone: { opacity: 1 },
  itemEmoji: { fontSize: 22 },
  track: { height: 5, width: '90%', backgroundColor: C.blush, borderRadius: 3, overflow: 'hidden', marginTop: 2 },
  fill: { height: 5, borderRadius: 3 },
  customer: { marginTop: 4, marginBottom: -6 },
  table: {
    width: '92%', height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'rgba(74,36,64,0.18)',
  },
  waiting: {
    position: 'absolute', left: 0, right: 0, bottom: COUNTER_H + 40, textAlign: 'center',
    color: C.ink, opacity: 0.55, fontWeight: '800',
  },
  counter: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: COUNTER_H, backgroundColor: C.cocoa,
    borderTopWidth: 4, borderTopColor: '#6E4329', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10,
  },
  counterEmoji: { fontSize: 34, marginTop: -26, marginRight: 8 },
  chips: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  chipText: { color: C.ink, fontWeight: '800', fontSize: 14 },
  chipEmpty: { color: '#F6DCC8', fontWeight: '700', fontSize: 13 },
});