import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="create-group" />
      <Stack.Screen name="add-friend" />
      <Stack.Screen name="new-contact" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="chat-settings" />
      <Stack.Screen name="shared-expenses" />
      <Stack.Screen name="shared-groups" />
    </Stack>
  );
}
