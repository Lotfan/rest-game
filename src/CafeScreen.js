import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Scene from './Scene.js';
import Food from './Food.js';
import { RECIPES, STOCK_MAX } from './data.js';
import { C, R } from './theme.js';

export default function CafeScreen({ state, dispatch }) {
  const { height } = useWindowDimensions();
const sceneH = Math.max(380, Math.min(520, height * 0.58));
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
          ovens={state.ovens}
          now={now}
          onServe={(customerId, itemIndex) => dispatch({ type: 'SERVE', customerId, itemIndex, now: Date.now() })}
        />
      </View>

      <View style={s.panel}>
        <Text style={s.label}>Tap to bake</Text>
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
                <Food id={r.id} size={62} />
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
  label: { color: C.inkSoft, fontWeight: '800', fontSize: 13, marginBottom: 1 },
  card: {
    width: 100, borderRadius: R.m, paddingVertical: 1, alignItems: 'center',
     
  },
  cardName: { color: C.ink, fontWeight: '800', fontSize: 13, marginTop: 2 },
  cardSub: { color: C.inkSoft, fontWeight: '700', fontSize: 11, marginTop: 1 },
});