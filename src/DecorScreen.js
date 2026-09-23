import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import Scene from './Scene.js';
import { SLOTS, DECOR } from './data.js';
import { SCENE_BACKGROUNDS } from './images.js';
import { cozyScore } from './game.js';
import { C, R } from './theme.js';

export default function DecorScreen({ state, dispatch }) {
  const [slot, setSlot] = useState('scene');
  const onScene = slot === 'scene';
  const slotInfo = SLOTS.find((x) => x.id === slot);
  const items = DECOR.filter((d) => d.slot === slot);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 12 }}>
        <Scene height={230} equipped={state.equipped} bg={state.bg} />
      </View>

      <Text style={s.cozy}>
        Cozy score {cozyScore(state.equipped)}: customers arrive faster, wait longer and tip more
      </Text>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.slots}>
          {SCENE_BACKGROUNDS.length > 0 && (
            <Pressable onPress={() => setSlot('scene')} style={[s.slotChip, onScene && s.slotChipOn]}>
              <Text style={[s.slotText, onScene && { color: C.white }]}>Background</Text>
            </Pressable>
          )}
          {SLOTS.map((x) => (
            <Pressable key={x.id} onPress={() => setSlot(x.id)} style={[s.slotChip, slot === x.id && s.slotChipOn]}>
              <Text style={[s.slotText, slot === x.id && { color: C.white }]}>{x.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={s.grid}>
        {onScene && (
          <Pressable
            onPress={() => dispatch({ type: 'SET_BG', id: null })}
            style={[s.tile, !state.bg && s.tileOn]}
          >
            <View style={[s.swatch, { backgroundColor: C.milk }]} />
            <Text style={s.tileName} numberOfLines={1}>None</Text>
            <Text style={s.tileSub}>{!state.bg ? 'In use' : 'Tap to use'}</Text>
          </Pressable>
        )}
        {onScene && SCENE_BACKGROUNDS.map((b) => {
          const equipped = state.bg === b.id;
          return (
            <Pressable
              key={b.id}
              onPress={() => dispatch({ type: 'SET_BG', id: b.id })}
              style={[s.tile, equipped && s.tileOn]}
            >
              <Image source={b.source} style={s.thumb} resizeMode="cover" />
              <Text style={s.tileName} numberOfLines={1}>{b.name}</Text>
              <Text style={s.tileSub}>{equipped ? 'In use' : 'Tap to use'}</Text>
            </Pressable>
          );
        })}
        {!onScene && items.map((d) => {
          const owned = state.owned.includes(d.id);
          const equipped = state.equipped[d.slot] === d.id;
          const canBuy = state.coins >= d.cost;
          return (
            <Pressable
              key={d.id}
              onPress={() => dispatch({ type: owned ? 'EQUIP' : 'BUY_DECOR', id: d.id })}
              style={[s.tile, equipped && s.tileOn, !owned && !canBuy && { opacity: 0.55 }]}
            >
              {slotInfo.kind === 'color' ? (
                <View style={[s.swatch, { backgroundColor: d.color }]} />
              ) : (
                <Text style={s.tileEmoji}>{d.emoji || '🚫'}</Text>
              )}
              <Text style={s.tileName} numberOfLines={1}>{d.name}</Text>
              <Text style={s.tileSub}>
                {equipped ? 'In use' : owned ? 'Tap to use' : `${d.cost} 🪙`}
                {d.cozy > 0 ? `  💗${d.cozy}` : ''}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  cozy: { color: C.inkSoft, fontWeight: '700', fontSize: 12, textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
  slots: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  slotChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: C.white, borderWidth: 2, borderColor: C.line },
  slotChipOn: { backgroundColor: C.berry, borderColor: C.berry },
  slotText: { color: C.ink, fontWeight: '800', fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 12, paddingBottom: 20 },
  tile: {
    width: '31.5%', backgroundColor: C.white, borderRadius: R.m, paddingVertical: 10, alignItems: 'center',
    borderWidth: 2, borderColor: C.line,
  },
  tileOn: { borderColor: C.berry, backgroundColor: C.blush },
  swatch: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(74,36,64,0.15)' },
  tileEmoji: { fontSize: 36, height: 40, lineHeight: 44 },
  thumb: { width: 56, height: 40, borderRadius: 8, borderWidth: 2, borderColor: 'rgba(74,36,64,0.15)' },
  tileName: { color: C.ink, fontWeight: '800', fontSize: 13, marginTop: 6 },
  tileSub: { color: C.inkSoft, fontWeight: '700', fontSize: 11, marginTop: 2 },
});