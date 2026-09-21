import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { C, R } from './theme.js';
import { xpNeeded, cozyScore } from './game.js';

export function TopBar({ state }) {
  const need = xpNeeded(state.level);
  const pct = Math.min(100, (state.xp / need) * 100);
  return (
    <View style={s.top}>
      <View style={s.pill}>
        <Text style={s.pillText}>🪙 {state.coins}</Text>
      </View>
      <View style={[s.pill, { flex: 1, marginHorizontal: 8 }]}>
        <Text style={s.pillText}>Level {state.level}</Text>
        <View style={s.xpTrack}>
          <View style={[s.xpFill, { width: `${pct}%` }]} />
        </View>
      </View>
      <View style={s.pill}>
        <Text style={s.pillText}>💗 {cozyScore(state.equipped)}</Text>
      </View>
    </View>
  );
}

export function TabBar({ tab, onChange }) {
  const tabs = [
    { id: 'cafe', label: 'Cafe', icon: '🏠' },
    { id: 'recipes', label: 'Recipes', icon: '📖' },
    { id: 'decor', label: 'Decorate', icon: '🛋️' },
  ];
  return (
    <View style={s.tabBar}>
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <Pressable key={t.id} style={[s.tab, active && s.tabActive]} onPress={() => onChange(t.id)}>
            <Text style={s.tabIcon}>{t.icon}</Text>
            <Text style={[s.tabLabel, active && { color: C.white }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <View pointerEvents="none" style={s.toastWrap}>
      <View style={s.toast}>
        <Text style={s.toastText}>{toast.text}</Text>
      </View>
    </View>
  );
}

export function Button({ label, onPress, disabled, style, tone = 'berry' }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[s.btn, tone === 'soft' && s.btnSoft, disabled && s.btnDisabled, style]}
    >
      <Text style={[s.btnText, tone === 'soft' && { color: C.ink }]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 6, paddingBottom: 10 },
  pill: {
    backgroundColor: C.white, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 2, borderColor: C.line,
  },
  pillText: { color: C.ink, fontWeight: '800', fontSize: 15 },
  xpTrack: { height: 6, borderRadius: 3, backgroundColor: C.blush, marginTop: 4, overflow: 'hidden' },
  xpFill: { height: 6, backgroundColor: C.berry, borderRadius: 3 },

  tabBar: {
    flexDirection: 'row', padding: 8, gap: 8, backgroundColor: C.white,
    borderTopWidth: 2, borderTopColor: C.line,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: R.m },
  tabActive: { backgroundColor: C.berry },
  tabIcon: { fontSize: 22 },
  tabLabel: { fontSize: 12, fontWeight: '800', color: C.inkSoft, marginTop: 2 },

  toastWrap: { position: 'absolute', top: 8, left: 0, right: 0, alignItems: 'center', zIndex: 20 },
  toast: {
    backgroundColor: C.ink, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8,
  },
  toastText: { color: C.white, fontWeight: '800', fontSize: 14 },

  btn: { backgroundColor: C.berry, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  btnSoft: { backgroundColor: C.blush },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: C.white, fontWeight: '800', fontSize: 14 },
});
