import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Scene from './Scene.js';
import Food from './Food.js';
import { RECIPES, STOCK_MAX } from './data.js';
import { C, R } from './theme.js';

export default function CafeScreen({ state, dispatch }) {
  const { height } = useWindowDimensions();
  const sceneH = Math.max(300, Math.min(400, height * 0.5));
  const now = Date.now();
  const unlocked = RECIPES.filter((r) => state.recipes.includes(r.id));

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 12 }}>
        <Scene
          bg={state.bg}
          height={sceneH}
          equipped={state.equipped}
          customers={state.customers}
          stock={state.stock}
          recipes={state.recipes}
          onServe={(customerId, itemIndex) => dispatch({ type: 'SERVE', customerId, itemIndex })}
        />
      </View>

      <View style={s.panel}>
        <Text style={s.label}>Ovens</Text>
        <View style={s.ovenRow}>
          {state.ovens.map((o, i) => {
            if (!o) {
              return (
                <View key={i} style={[s.oven, s.ovenEmpty]}>
                  <Text style={s.ovenFire}>🔥</Text>
                  <Text style={s.ovenSub}>free</Text>
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

        <Text style={[s.label, { marginTop: 10 }]}>Tap to bake</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 12 }}>
          {unlocked.map((r) => {
            const have = state.stock[r.id] || 0;
            const full = have >= STOCK_MAX;
            return (
              <Pressable
                key={r.id}
                onPress={() => dispatch({ type: 'BAKE', recipeId: r.id, now: Date.now() })}
                style={[s.card, full && { opacity: 0.5 }]}
              >
                <Food id={r.id} size={34} />
                <Text style={s.cardName} numberOfLines={1}>{r.name}</Text>
                <Text style={s.cardSub}>{r.bakeSec}s · have {have}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  panel: { paddingHorizontal: 12, paddingTop: 12 },
  label: { color: C.inkSoft, fontWeight: '800', fontSize: 13, marginBottom: 6 },
  ovenRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  oven: {
    width: 58, height: 58, borderRadius: R.m, backgroundColor: C.butter, alignItems: 'center',
    justifyContent: 'center', overflow: 'hidden', borderWidth: 2, borderColor: '#F0CC66',
  },
  ovenEmpty: { backgroundColor: C.white, borderColor: C.line },
  ovenFire: { fontSize: 20, opacity: 0.35 },
  ovenEmoji: { fontSize: 24 },
  ovenSub: { fontSize: 11, fontWeight: '800', color: C.inkSoft },
  ovenTrack: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 5, backgroundColor: 'rgba(74,36,64,0.12)' },
  ovenFill: { height: 5, backgroundColor: C.berry },
  card: {
    width: 92, backgroundColor: C.white, borderRadius: R.m, paddingVertical: 8, alignItems: 'center',
    borderWidth: 2, borderColor: C.line,
  },
  cardEmoji: { fontSize: 30 },
  cardName: { color: C.ink, fontWeight: '800', fontSize: 13, marginTop: 2 },
  cardSub: { color: C.inkSoft, fontWeight: '700', fontSize: 11, marginTop: 1 },
});