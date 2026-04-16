import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { fetchProducts } from '../api/productsApi';

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Завантаження товарів з API
  const loadProducts = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError('Не вдалося завантажити товари. Перевірте з\'єднання з інтернетом.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Оновлення при свайпі вниз
  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  // Фільтрація
  let filteredProducts = products;
  if (searchText.trim()) {
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  // Сортування
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    return b.price - a.price;
  });

  // Картка товару
  const ProductCard = ({ product }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/product/${product.id}?id=${product.id}`)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  // Стан завантаження
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Завантаження товарів...</Text>
      </View>
    );
  }

  // Стан помилки
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
          <Text style={styles.retryButtonText}>Спробувати знову</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Каталог товарів</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Пошук за назвою..."
        value={searchText}
        onChangeText={setSearchText}
        clearButtonMode="while-editing"
      />

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Сортувати за ціною:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortOrder === 'asc' && styles.activeSort]}
          onPress={() => setSortOrder('asc')}
        >
          <Text style={sortOrder === 'asc' ? styles.activeSortText : styles.sortButtonText}>
            Від дешевших
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortOrder === 'desc' && styles.activeSort]}
          onPress={() => setSortOrder('desc')}
        >
          <Text style={sortOrder === 'desc' ? styles.activeSortText : styles.sortButtonText}>
            Від дорожчих
          </Text>
        </TouchableOpacity>
      </View>

      {sortedProducts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Нічого не знайдено 😕</Text>
        </View>
      ) : (
        <FlatList
          data={sortedProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
          numColumns={2}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  sortLabel: {
    fontSize: 14,
    color: '#555',
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeSort: {
    backgroundColor: '#3498db',
  },
  sortButtonText: {
    color: '#333',
  },
  activeSortText: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#2c3e50',
    marginTop: 4,
  },
  loadingText: {
    fontSize: 18,
    color: '#3498db',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});