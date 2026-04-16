import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { fetchProductById } from '../../api/productsApi';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme, toggleFavorite, isFavorite } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Не вдалося завантажити інформацію про товар');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Завантаження товару...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>{error || 'Товар не знайдено'}</Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.primary }]} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Повернутися назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.imageContainer, { backgroundColor: theme.card }]}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{product.title}</Text>
        <Text style={[styles.price, { color: theme.secondary }]}>${product.price.toFixed(2)}</Text>
        <Text style={[styles.category, { color: theme.text + '80' }]}>📂 {product.category}</Text>
        
        <View style={[styles.section, { borderTopColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Опис</Text>
          <Text style={[styles.description, { color: theme.text }]}>{product.description}</Text>
        </View>
        
        <View style={[styles.section, { borderTopColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Рейтинг</Text>
          <Text style={[styles.rating, { color: theme.text }]}>
            ⭐ {product.rating?.rate} / 5 ({product.rating?.count} відгуків)
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: isFavorite(product.id) ? theme.error : theme.card, borderColor: theme.border }]}
          onPress={() => toggleFavorite(product.id)}
        >
          <Text style={styles.favoriteButtonText}>
            {isFavorite(product.id) ? '❤️ Видалити з обраного' : '🤍 Додати в обране'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  image: {
    width: 250,
    height: 250,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  category: {
    fontSize: 16,
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  rating: {
    fontSize: 16,
  },
  favoriteButton: {
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});