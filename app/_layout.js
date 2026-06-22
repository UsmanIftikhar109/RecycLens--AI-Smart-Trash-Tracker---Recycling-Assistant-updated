import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './utils/auth-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="scan" />
          <Stack.Screen name="scan-result" />
          <Stack.Screen name="guide" />
          <Stack.Screen name="ai-tips" />
          <Stack.Screen name="centers" />
          <Stack.Screen name="success" />
          <Stack.Screen name="history" />
          <Stack.Screen name="history-detail" />
          <Stack.Screen name="profile" />
        </Stack>
        <StatusBar style="dark" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
