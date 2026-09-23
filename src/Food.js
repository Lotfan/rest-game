// Shows a food item: your PNG if you added one, otherwise a fallback.
import React from 'react';
import { View, Image, Text } from 'react-native';
import { FOOD_IMAGES } from './images.js';

export default function Food({ id, size = 24 }) {
  const img = FOOD_IMAGES[id];
  const box = { width: size * 1.2, height: size * 1.2, alignItems: 'center', justifyContent: 'center' };
  return (
    <View style={box}>
      {img ? (
        <Image source={img} style={{ width: size, height: size }} resizeMode="contain" />
      ) : (
        <Text style={{ fontSize: size * 0.92, lineHeight: size * 1.1 }}>❓</Text>
      )}
    </View>
  );
}