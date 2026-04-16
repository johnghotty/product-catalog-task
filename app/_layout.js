import { Tabs } from 'expo-router';
import { AppProvider, useApp } from '../context/AppContext';
import Toast from 'react-native-toast-message';
import { Text } from 'react-native';

function TabIcon({ color, children }) {
  return <Text style={{ fontSize: 24, color }}>{children}</Text>;
}

function TabLayout() {
  const { theme } = useApp();
  
  return (
    <>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: theme.header },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitle: 'Назад', // Стандартна кнопка назад
          tabBarStyle: { backgroundColor: theme.card },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.text,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Каталог',
            headerTitle: 'Каталог товарів',
            tabBarIcon: ({ color }) => <TabIcon color={color}>🏠</TabIcon>,
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Обране',
            headerTitle: 'Обрані товари',
            tabBarIcon: ({ color }) => <TabIcon color={color}>❤️</TabIcon>,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Профіль',
            headerTitle: 'Налаштування',
            tabBarIcon: ({ color }) => <TabIcon color={color}>👤</TabIcon>,
          }}
        />
        <Tabs.Screen
          name="product/[id]"
          options={{
            href: null,
            title: 'Деталі товару',
            headerTitle: 'Деталі товару',
            headerBackTitle: 'Назад',
          }}
        />
      </Tabs>
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <TabLayout />
    </AppProvider>
  );
}