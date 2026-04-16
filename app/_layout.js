import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="product/[id]" 
        options={{ 
          title: 'Деталі товару',
          headerBackTitle: 'Назад'
        }} 
      />
    </Stack>
  );
}