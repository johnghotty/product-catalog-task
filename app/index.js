import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { fetchProducts } from '../api/productsApi';
import { getCachedProducts, cacheProducts } from '../utils/storage';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import Toast from 'react-native-toast-message';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, favorites, toggleFavorite, isFavorite } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadProducts = useCallback(async (showCache = true) => {
    try {
      if (showCache) {
        const cached = await getCachedProducts();
        if (cached) {
          setProducts(cached);
          setLoading(false);
        }
      }

      const data = await fetchProducts();
      setProducts(data);
      await cacheProducts(data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Помилка',
        text2: 'Не вдалося завантажити товари',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts(false);
  };

  let filteredProducts = products;
  
  if (searchText.trim()) {
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  
  if (selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(
      product => product.category === selectedCategory
    );
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    return b.price - a.price;
  });

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <Text style={{ color: theme.text, fontSize: 16 }}>Завантаження товарів...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>🛍️ Каталог товарів</Text>

      <View style={styles.searchWrapper}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
          placeholder="🔍 Пошук за назвою..."
          placeholderTextColor={theme.text + '80'}
          value={searchText}
          onChangeText={setSearchText}
          clearButtonMode="while-editing"
        />
      </View>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        theme={theme}
      />

      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: theme.text }]}>💰 Сортувати:</Text>
        <TouchableOpacity
          style={[styles.sortButton, { backgroundColor: theme.card }, sortOrder === 'asc' && { backgroundColor: theme.primary }]}
          onPress={() => setSortOrder('asc')}
        >
          <Text style={[styles.sortButtonText, { color: theme.text }, sortOrder === 'asc' && { color: '#fff' }]}>
            Від дешевших
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, { backgroundColor: theme.card }, sortOrder === 'desc' && { backgroundColor: theme.primary }]}
          onPress={() => setSortOrder('desc')}
        >
          <Text style={[styles.sortButtonText, { color: theme.text }, sortOrder === 'desc' && { color: '#fff' }]}>
            Від дорожчих
          </Text>
        </TouchableOpacity>
      </View>

      {sortedProducts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>😕 Нічого не знайдено</Text>
        </View>
      ) : (
        <FlatList
          data={sortedProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/product/${item.id}?id=${item.id}`)}
              onFavoritePress={() => toggleFavorite(item.id)}
              isFavorite={isFavorite(item.id)}
              theme={theme}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />
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
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 12,
    flexWrap: 'wrap',
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
});