import { useEffect, useState } from 'react';
import { Stack, Slot } from 'expo-router';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from '../store';
import { checkAuth } from '../store/slices/authSlice';
import { View, Image, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function CustomSplash() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash.png')}
        style={styles.splashImage}
        resizeMode="contain"
      />
    </View>
  );
}

function RootLayoutNav() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await dispatch(checkAuth());
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, [dispatch]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <Slot />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={isAuthenticated ? '(tabs)' : '(auth)'}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(auth)"
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
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImage: {
    width: '60%',
    height: '60%',
  },
});

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
