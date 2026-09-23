// The picture of your cafe: walls, floor, decorations, tables, customers and the counter.
import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, ImageBackground, StyleSheet, Platform } from 'react-native';
import { C } from './theme.js';
import { SEATS } from './data.js';
import { RECIPES } from './data.js';
import { decorById } from './game.js';
import Food from './Food.js';
import Character from './Character.js';
import { SCENE_BACKGROUNDS } from './images.js';

const COUNTER_H = 50;

// Several overlapping, unevenly-sized lumps (offset from each other, not sharing one
// centre) so the outline reads as one puffy irregular cloud rather than a circle.
// Fractions are relative to the badge's overall size.
const LUMPS = [
  { dx: -0.30, dy: 0.07, r: 0.58 },
  { dx: 0.29, dy: 0.05, r: 0.55 },
  { dx: -0.11, dy: -0.27, r: 0.50 },
  { dx: 0.17, dy: -0.23, r: 0.47 },
  { dx: -0.05, dy: 0.25, r: 0.53 },
  { dx: 0.02, dy: -0.02, r: 0.74 },
];

// Soft fog behind an order icon. Each lump gets its own low-opacity glow (so the haze
// follows the irregular outline instead of forming rings around one shared centre),
// then the same lumps are drawn solid on top to bind them into a single shape.
function Puff({ size, color }) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, webBlur]}>
      {LUMPS.map((l, i) => {
        const d = size * l.r * 1.7;
        const cx = size / 2 + l.dx * size;
        const cy = size / 2 + l.dy * size;
        return (
          <View
            key={`glow${i}`}
            style={{ position: 'absolute', width: d, height: d, borderRadius: d / 2, left: cx - d / 2, top: cy - d / 2, backgroundColor: color, opacity: 0.13 }}
          />
        );
      })}
      {LUMPS.map((l, i) => {
        const d = size * l.r;
        const cx = size / 2 + l.dx * size;
        const cy = size / 2 + l.dy * size;
        return (
          <View
            key={`core${i}`}
            style={{ position: 'absolute', width: d, height: d, borderRadius: d / 2, left: cx - d / 2, top: cy - d / 2, backgroundColor: color, opacity: 0.9 }}
          />
        );
      })}
    </View>
  );
}

// Web can genuinely blur the edges; native quietly ignores this and keeps the soft-glow look above.
const webBlur = Platform.OS === 'web' ? { filter: 'blur(2.5px)' } : null;

// The cup gets smaller as an order has more items, so 3 cups still fit at the table.
const cupSizeFor = (orderLen) => (orderLen <= 1 ? 36 : orderLen === 2 ? 30 : 24);

// A single ordered drink. When it's served, the cup visibly drifts down toward the
// customer and fades as a checkmark fades in — instead of just instantly flipping.
function OrderCup({ item, cup, puff, have, onPress }) {
  const deliver = useRef(new Animated.Value(item.done ? 1 : 0)).current;
  const wasDone = useRef(item.done);

  useEffect(() => {
    if (item.done && !wasDone.current) {
      Animated.timing(deliver, { toValue: 1, duration: 420, useNativeDriver: true }).start();
    }
    wasDone.current = item.done;
  }, [item.done, deliver]);

  const tone = item.done ? C.pistachio : C.pink;
  const ready = have || item.done;

  return (
    <Pressable disabled={item.done} onPress={onPress} style={[s.item, { width: puff, height: puff, opacity: ready ? 1 : 0.5 }]}>
      <Puff size={puff} color={tone} />
      <Animated.View
        style={{
          opacity: deliver.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
          transform: [
            { translateY: deliver.interpolate({ inputRange: [0, 1], outputRange: [0, 30] }) },
            { scale: deliver.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }) },
          ],
        }}
      >
        <Food id={item.id} size={cup} />
      </Animated.View>
      <Animated.Text style={{ position: 'absolute', fontSize: cup * 0.75, opacity: deliver }}>✅</Animated.Text>
    </Pressable>
  );
}

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
                const cup = cupSizeFor(customer.order.length);
                const puff = cup * 1.9;
                return (
                  <OrderCup
                    key={i}
                    item={item}
                    cup={cup}
                    puff={puff}
                    have={have}
                    onPress={() => onServe(customer.id, i)}
                  />
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

export default function Scene({ equipped, customers = [], stock = {}, recipes = [], onServe, height, bg, ovens = [], now = Date.now() }) {
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

      {ovens.length > 0 && (
        <View style={s.ovenRow}>
          {ovens.map((o, i) => {
            if (!o) {
              return (
                <View key={i} style={[s.oven, s.ovenEmpty]}>
                  <Text style={s.ovenFire}>🔥</Text>
                </View>
              );
            }
            const r = RECIPES.find((x) => x.id === o.recipeId);
            const total = o.doneAt - o.startedAt;
            const pct = Math.min(1, Math.max(0, (now - o.startedAt) / total));
            const secs = Math.max(0, Math.ceil((o.doneAt - now) / 1000));
            return (
              <View key={i} style={s.oven}>
                <Food id={r.id} size={26} />
                <Text style={s.ovenSub}>{secs}s</Text>
                <View style={s.ovenTrack}>
                  <View style={[s.ovenFill, { width: `${pct * 100}%` }]} />
                </View>
              </View>
            );
          })}
        </View>
      )}

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
              <Food id={r.id} size={26} />
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
  ovenRow: { position: 'absolute', top: 8, left: 8, right: 8, flexDirection: 'row', gap: 6, zIndex: 5 },
  oven: {
  width: 44,
  height: 44,
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: 'transparent', // no background
  borderWidth: 0,                 // no border
},

ovenEmpty: {
  backgroundColor: 'transparent',
  borderWidth: 0,
},
  ovenFire: { fontSize: 18, opacity: 0.4 },
  ovenSub: { fontSize: 9, fontWeight: '800', color: C.inkSoft },
  ovenTrack: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, backgroundColor: 'rgba(74,36,64,0.12)' },
  ovenFill: { height: 4, backgroundColor: C.berry },
  lights: { position: 'absolute', top: 4, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around' },
  lightEmoji: { fontSize: 22 },
  win: { position: 'absolute', left: 22, fontSize: 64 },
  art: { position: 'absolute', right: 26, fontSize: 48 },
  floor: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 4, borderTopColor: 'rgba(74,36,64,0.12)' },
  plant: { position: 'absolute', right: 8, fontSize: 44 },
  seats: { position: 'absolute', left: 6, right: 6, flexDirection: 'row', alignItems: 'flex-end' },
  seat: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 3 },
  bubble: { alignItems: 'center', minWidth: 48, marginBottom: 2 },
  bubbleItems: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap', gap: 2 },
  item: { alignItems: 'center', justifyContent: 'center' },
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
    borderTopWidth: 1, borderTopColor: '#6E4329', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10,
  },
  counterEmoji: { fontSize: 34, marginTop: -26, marginRight: 8 },
  chips: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 2 },
  chipText: { color: C.white, fontWeight: '800', fontSize: 15 },
  chipEmpty: { color: '#F6DCC8', fontWeight: '700', fontSize: 13 },
});