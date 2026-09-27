import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../features/auth/AuthContext';
import AppNavigator from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';
import { colors } from '../theme/colors';

export default function RootNavigator() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={colors.bulb} />
      </View>
    );
  }

  return session ? <AppNavigator /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  splash: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    flex: 1,
    justifyContent: 'center',
  },
});
