import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useApp } from '../context/AppContext';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const { theme, themeMode, toggleTheme, favorites } = useApp();

  const showInfo = () => {
    Toast.show({
      type: 'info',
      text1: 'Інформація',
      text2: `Обраних товарів: ${favorites.length}`,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Налаштування</Text>
      
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Вигляд</Text>
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, { color: theme.text }]}>Темна тема</Text>
          <Switch
            value={themeMode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: theme.primary }}
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Інформація</Text>
        
        <TouchableOpacity style={styles.infoItem} onPress={showInfo}>
          <Text style={[styles.infoText, { color: theme.text }]}>Про додаток</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>Версія 1.0.0</Text>
        </TouchableOpacity>
        
        <View style={styles.infoItem}>
          <Text style={[styles.infoText, { color: theme.text }]}>Обраних товарів</Text>
          <Text style={[styles.infoValue, { color: theme.primary }]}>{favorites.length}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingText: {
    fontSize: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  infoText: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});