// Shows a customer: one of your PNGs if you added any, otherwise the emoji animal.
import React from 'react';
import { Image, Text } from 'react-native';
import { CHARACTER_IMAGES } from './images.js';

export default function Character({ customer, size = 56 }) {
  if (CHARACTER_IMAGES.length > 0) {
    const src = CHARACTER_IMAGES[customer.skin % CHARACTER_IMAGES.length];
    return <Image source={src} style={{ width: size, height: size }} resizeMode="contain" />;
  }
  return <Text style={{ fontSize: size * 0.8, lineHeight: size }}>{customer.emoji}</Text>;
}
