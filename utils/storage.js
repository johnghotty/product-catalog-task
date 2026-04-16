import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  FAVORITES: '@favorites',
  THEME: '@theme',
  CACHE_PRODUCTS: '@cache_products',
  CACHE_TIMESTAMP: '@cache_timestamp',
};

// Кешування товарів (на 5 хвилин)
export const cacheProducts = async (products) => {
  try {
    await AsyncStorage.setItem(KEYS.CACHE_PRODUCTS, JSON.stringify(products));
    await AsyncStorage.setItem(KEYS.CACHE_TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error('Помилка кешування:', error);
  }
};

export const getCachedProducts = async () => {
  try {
    const cached = await AsyncStorage.getItem(KEYS.CACHE_PRODUCTS);
    const timestamp = await AsyncStorage.getItem(KEYS.CACHE_TIMESTAMP);
    
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      if (age < 5 * 60 * 1000) { // 5 хвилин
        return JSON.parse(cached);
      }
    }
    return null;
  } catch (error) {
    console.error('Помилка отримання кешу:', error);
    return null;
  }
};

// Робота з обраним
export const getFavorites = async () => {
  try {
    const favorites = await AsyncStorage.getItem(KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Помилка отримання обраного:', error);
    return [];
  }
};

export const toggleFavorite = async (productId) => {
  try {
    const favorites = await getFavorites();
    let newFavorites;
    
    if (favorites.includes(productId)) {
      newFavorites = favorites.filter(id => id !== productId);
    } else {
      newFavorites = [...favorites, productId];
    }
    
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(newFavorites));
    return newFavorites;
  } catch (error) {
    console.error('Помилка оновлення обраного:', error);
    throw error;
  }
};

// Робота з темою
export const getTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem(KEYS.THEME);
    return theme || 'light';
  } catch (error) {
    console.error('Помилка отримання теми:', error);
    return 'light';
  }
};

export const saveTheme = async (theme) => {
  try {
    await AsyncStorage.setItem(KEYS.THEME, theme);
  } catch (error) {
    console.error('Помилка збереження теми:', error);
  }
};