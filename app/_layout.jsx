import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from '../store';
import { checkAuth } from '../store/slices/authSlice';

function RootLayoutNav() {
  const dispatch = useDispatch();
  const { isAuthenticated, isSignup } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Determine initial route
  let initialRoute = 'signup';
  if (isAuthenticated) {
    initialRoute = '(tabs)';
  } else if (isSignup) {
    initialRoute = 'email-verify';
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen 
        name="(tabs)" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="create-group" />
      <Stack.Screen name="add-friend" />
      <Stack.Screen name="new-contact" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="chat-settings" />
      <Stack.Screen name="shared-expenses" />
      <Stack.Screen name="shared-groups" />
      <Stack.Screen 
        name="signup"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="email-verify"
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
