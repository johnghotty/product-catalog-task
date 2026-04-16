import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const categories = [
  { id: 'all', name: 'Всі' },
  { id: "men's clothing", name: '👔 Чоловічий одяг' },
  { id: "women's clothing", name: '👗 Жіночий одяг' },
  { id: 'electronics', name: '📱 Електроніка' },
  { id: 'jewelery', name: '💍 Прикраси' },
];

const CategoryFilter = ({ selectedCategory, onSelectCategory, theme }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              { backgroundColor: theme.card, borderColor: theme.border },
              selectedCategory === category.id && [styles.activeButton, { backgroundColor: theme.primary }]
            ]}
            onPress={() => onSelectCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                { color: theme.text },
                selectedCategory === category.id && styles.activeText
              ]}
              numberOfLines={1}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    minWidth: 110,
    alignItems: 'center',
  },
  activeButton: {
    borderColor: 'transparent',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#fff',
  },
});

export default CategoryFilter;