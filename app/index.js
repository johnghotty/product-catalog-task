import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

// Демо-дані (замість API)
const DEMO_PRODUCTS = [
  {
    id: 1,
    title: 'Ноутбук MacBook Pro',
    price: 49999,
    image: 'https://picsum.photos/id/0/200/200',
  },
  {
    id: 2,
    title: 'Смартфон iPhone 15',
    price: 39999,
    image: 'https://picsum.photos/id/1/200/200',
  },
  {
    id: 3,
    title: 'Навушники Sony WH-1000XM5',
    price: 12999,
    image: 'https://picsum.photos/id/2/200/200',
  },
  {
    id: 4,
    title: 'Планшет iPad Air',
    price: 24999,
    image: 'https://picsum.photos/id/3/200/200',
  },
  {
    id: 5,
    title: 'Смарт-годинник Apple Watch',
    price: 15999,
    image: 'https://picsum.photos/id/4/200/200',
  },
  {
    id: 6,
    title: 'Бездротова клавіатура Logitech',
    price: 2999,
    image: 'https://picsum.photos/id/5/200/200',
  },
];

export default function HomeScreen() {
  const [products] = useState(DEMO_PRODUCTS);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

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
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
      <Text style={styles.price}>{product.price.toLocaleString()} ₴</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Каталог товарів</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Пошук за назвою..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Сортувати:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortOrder === 'asc' && styles.activeSort]}
          onPress={() => setSortOrder('asc')}
        >
          <Text>Від дешевших</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortOrder === 'desc' && styles.activeSort]}
          onPress={() => setSortOrder('desc')}
        >
          <Text>Від дорожчих</Text>
        </TouchableOpacity>
      </View>

      {sortedProducts.length === 0 ? (
        <Text style={styles.emptyText}>Нічого не знайдено</Text>
      ) : (
        <FlatList
          data={sortedProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
          numColumns={2}
          contentContainerStyle={styles.list}
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
  list: {
    paddingHorizontal: 8,
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#999',
  },
});