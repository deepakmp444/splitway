import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function GroupsLayout() {
  return (
    <SafeAreaProvider>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' }
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="[id]" />
        <Stack.Screen name="create-group" />
      </Stack>
    </SafeAreaProvider>
  );
} 