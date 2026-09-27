import { AppState, Button, StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from './src/lib/supabase';
import { AuthProvider, useAuth } from './src/features/auth/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationTheme } from './src/navigation/navigationTheme';
import { ToastProvider } from './src/components/Toast';

const queryClient = new QueryClient();

AppState.addEventListener('change', state => {
  state === 'active'
    ? supabase.auth.startAutoRefresh()
    : supabase.auth.stopAutoRefresh();
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <ToastProvider>
            <StatusBar barStyle="light-content" />
              <NavigationContainer theme={navigationTheme}>
                <RootNavigator />
              </NavigationContainer>
          </ToastProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
