import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ product, onPress, onFavoritePress, isFavorite, theme }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.text }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <TouchableOpacity 
        style={styles.favoriteButton} 
        onPress={onFavoritePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>
      
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{product.title}</Text>
      <Text style={[styles.price, { color: theme.secondary }]}>${product.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    padding: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ProductCard;