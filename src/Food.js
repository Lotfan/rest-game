// Shows a food item:
// - Uses your PNG if one exists in FOOD_IMAGES
// - Otherwise uses the recipe emoji
// - Safely handles an unknown/missing food ID

import React from 'react';
import { View, Image, Text } from 'react-native';

import { FOOD_IMAGES } from './images.js';
import { recipeById } from './game.js';

export default function Food({ id, size = 24 }) {
  // Look for a custom PNG for this food.
  const img = FOOD_IMAGES?.[id];

  // Look for the recipe.
  const recipe = recipeById?.(id);

  const box = {
    width: size * 1.2,
    height: size * 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <View style={box}>
      {img ? (
        // Custom PNG exists, so show it.
        <Image
          source={img}
          style={{
            width: size,
            height: size,
          }}
          resizeMode="contain"
        />
      ) : (
        // No PNG: safely show the recipe emoji.
        <Text
          style={{
            fontSize: size * 0.92,
            lineHeight: size * 1.1,
          }}
        >
          {recipe?.image ?? '🍽️'}
        </Text>
      )}
    </View>
  );
}