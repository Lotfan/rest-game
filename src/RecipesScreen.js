import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { RECIPES } from './data.js';
import { nextOvenCost } from './game.js';
import { Button } from './ui.js';
import Food from './Food.js';
import { C, R } from './theme.js';

export default function RecipesScreen({ state, dispatch }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const ovenCost = nextOvenCost(state.ovens.length);

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <View style={s.card}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Ovens: {state.ovens.length}</Text>
          <Text style={s.sub}>More ovens = more baking at once</Text>
        </View>
        {ovenCost === null ? (
          <Text style={s.max}>Max</Text>
        ) : (
          <Button label={`Add oven · ${ovenCost} 🪙`} disabled={state.coins < ovenCost} onPress={() => dispatch({ type: 'BUY_OVEN' })} />
        )}
      </View>

      <Text style={s.heading}>Recipe book</Text>
      {RECIPES.map((r) => {
        const learned = state.recipes.includes(r.id);
        const tooLow = state.level < r.level;
        return (
          <View key={r.id} style={[s.card, !learned && tooLow && { opacity: 0.6 }]}>
            <Food id={r.id} size={38} />
            <View style={{ flex: 1 }}>
              <Text style={s.title}>{r.name}</Text>
              <Text style={s.sub}>Sells for {r.price} 🪙 · bakes in {r.bakeSec}s</Text>
            </View>
            {learned ? (
              <Text style={s.learned}>Learned ✓</Text>
            ) : tooLow ? (
              <Text style={s.lock}>Level {r.level}</Text>
            ) : (
              <Button label={`Learn · ${r.cost} 🪙`} disabled={state.coins < r.cost} onPress={() => dispatch({ type: 'BUY_RECIPE', id: r.id })} />
            )}
          </View>
        );
      })}

      <Text style={s.stats}>Customers served: {state.totalServed}</Text>
      <Button
        tone="soft"
        label={confirmReset ? 'Tap again to erase everything' : 'Start over'}
        onPress={() => {
          if (confirmReset) { dispatch({ type: 'RESET' }); setConfirmReset(false); } else { setConfirmReset(true); }
        }}
        style={{ alignSelf: 'center', marginTop: 8 }}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 12, paddingBottom: 30, gap: 8 },
  heading: { color: C.ink, fontWeight: '900', fontSize: 20, marginTop: 8 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: R.m,
    padding: 12, borderWidth: 2, borderColor: C.line,
  },
  emoji: { fontSize: 34 },
  title: { color: C.ink, fontWeight: '800', fontSize: 16 },
  sub: { color: C.inkSoft, fontWeight: '600', fontSize: 12, marginTop: 2 },
  learned: { color: C.good, fontWeight: '900' },
  lock: { color: C.inkSoft, fontWeight: '800' },
  max: { color: C.good, fontWeight: '900' },
  stats: { color: C.inkSoft, fontWeight: '700', textAlign: 'center', marginTop: 12 },
});
