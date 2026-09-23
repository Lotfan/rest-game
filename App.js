import React, { useEffect, useReducer, useRef, useState } from 'react';
import { View, Text, Modal, AppState, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { reducer, initialState, SAVE_KEYS } from './src/game.js';
import { TopBar, TabBar, Toast, Button } from './src/ui.js';
import CafeScreen from './src/CafeScreen.js';
import RecipesScreen from './src/RecipesScreen.js';
import DecorScreen from './src/DecorScreen.js';
import { C, R } from './src/theme.js';

const SAVE_KEY = 'cozycafe.save.v1';

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [tab, setTab] = useState('cafe');
  const appActive = useRef(true);

  // Load the saved game once when the app opens.
  useEffect(() => {
    (async () => {
      let saved = null;
      try {
        const raw = await AsyncStorage.getItem(SAVE_KEY);
        if (raw) saved = JSON.parse(raw);
      } catch (e) {}
      dispatch({ type: 'LOAD', saved });
    })();
  }, []);

  // Save the game a moment after anything worth saving changes.
  const lastSaved = useRef('');
  useEffect(() => {
    if (!state.loaded) return undefined;
    const data = {};
    SAVE_KEYS.forEach((k) => { data[k] = state[k]; });
    const json = JSON.stringify(data);
    if (json === lastSaved.current) return undefined;
    const t = setTimeout(() => {
      lastSaved.current = json;
      AsyncStorage.setItem(SAVE_KEY, json).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [state]);

  // Pause customers when the app is in the background.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => { appActive.current = next === 'active'; });
    return () => sub.remove();
  }, []);

  // The game clock: ticks twice a second.
  useEffect(() => {
    if (!state.loaded) return undefined;
    const id = setInterval(() => {
      dispatch({ type: 'TICK', now: Date.now(), playing: tab === 'cafe' && appActive.current });
    }, 500);
    return () => clearInterval(id);
  }, [state.loaded, tab]);

  if (!state.loaded) {
    return (
      <View style={[s.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontSize: 48 }}>🥐</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.root} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <TopBar state={state} />
        <View style={{ flex: 1 }}>
          {tab === 'cafe' && <CafeScreen state={state} dispatch={dispatch} />}
          {tab === 'recipes' && <RecipesScreen state={state} dispatch={dispatch} />}
          {tab === 'decor' && <DecorScreen state={state} dispatch={dispatch} />}
          <Toast toast={state.toast} />
        </View>
        <TabBar tab={tab} onChange={setTab} />

        {/* <Modal visible={!state.seenHelp} transparent animationType="fade">
          <View style={s.backdrop}>
            <View style={s.help}>
              <Text style={s.helpTitle}>Welcome to your cafe 🥐</Text>
              <Text style={s.helpLine}>1. Bake: tap a recipe at the bottom. It goes in an oven, then onto the counter.</Text>
              <Text style={s.helpLine}>2. Serve: customers show what they want in a bubble. Tap an item when it's on the counter.</Text>
              <Text style={s.helpLine}>3. Grow: spend coins in Recipes (new food, more ovens) and Decorate (cozier cafe = more customers and tips).</Text>
              <Button label="Open the cafe" onPress={() => dispatch({ type: 'DISMISS_HELP' })} style={{ marginTop: 14 }} />
            </View>
          </View>
        </Modal> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.milk },
  backdrop: { flex: 1, backgroundColor: 'rgba(74,36,64,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  help: { backgroundColor: C.white, borderRadius: R.l, padding: 20, width: '100%', maxWidth: 420 },
  helpTitle: { color: C.ink, fontWeight: '900', fontSize: 22, marginBottom: 10 },
  helpLine: { color: C.ink, fontWeight: '600', fontSize: 15, lineHeight: 21, marginTop: 6 },
});
