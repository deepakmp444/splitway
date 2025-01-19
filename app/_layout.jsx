import { Stack } from 'expo-router';

export default function RootLayout() {
  
  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="search" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="add-friend" />
        <Stack.Screen name="new-contact" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="chat-settings" />
        <Stack.Screen name="shared-expenses" options={{ title: 'Shared Expenses' }} />
        <Stack.Screen name="shared-groups" options={{ title: 'Shared Groups' }} />
        <Stack.Screen name="(tabs)" />
      </Stack>
  );
}
