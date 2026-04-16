import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFavorites, getTheme, saveTheme, toggleFavorite as storageToggleFavorite } from '../utils/storage';
import { lightTheme, darkTheme } from '../constants/theme';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [themeMode, setThemeMode] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const [savedFavorites, savedTheme] = await Promise.all([
        getFavorites(),
        getTheme(),
      ]);
      setFavorites(savedFavorites);
      setThemeMode(savedTheme);
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (productId) => {
    try {
      const newFavorites = await storageToggleFavorite(productId);
      setFavorites(newFavorites);
      return newFavorites;
    } catch (error) {
      console.error('Помилка:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    await saveTheme(newTheme);
  };

  const isFavorite = (productId) => favorites.includes(productId);

  return (
    <AppContext.Provider
      value={{
        favorites,
        theme,
        themeMode,
        isLoading,
        toggleFavorite,
        toggleTheme,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};