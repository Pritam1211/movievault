import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '../../../components/AppText';
import { colors } from '../../../theme/colors';
import { useAuth } from '../../auth/AuthContext';
import type { AppStackParamList } from '../../../navigation/types';
import { version } from '../../../../package.json';

type Props = NativeStackScreenProps<AppStackParamList, 'Account'>;

export default function AccountScreen({ navigation }: Props) {
  const { session, signOut } = useAuth();

  const confirmSignOut = () => {
    Alert.alert('Sign out?', 'You can sign back in at any time.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={navigation.goBack}
          hitSlop={12}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppText variant="strong" style={styles.backText}>
            ←
          </AppText>
        </Pressable>

        <AppText variant="title">Account</AppText>

        <View style={styles.block}>
          <AppText variant="label">Signed in as</AppText>
          <AppText variant="body" style={styles.email}>
            {session?.user.email ?? 'Unknown'}
          </AppText>
        </View>

        <Pressable
          style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}
          onPress={confirmSignOut}
        >
          <AppText variant="strong" style={styles.signOutText}>
            Sign out
          </AppText>
        </Pressable>

        <View style={styles.divider} />

        <View style={styles.block}>
          <AppText variant="label">Film data</AppText>
          <AppText variant="body" style={styles.attribution}>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </AppText>
          <Pressable
            onPress={() => Linking.openURL('https://www.themoviedb.org/')}
            hitSlop={8}
          >
            <AppText variant="label" style={styles.link}>
              themoviedb.org
            </AppText>
          </Pressable>
        </View>

        <AppText variant="caption" style={styles.version}>
          MovieVault {version}
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.ink, flex: 1 },
  content: { paddingBottom: 40, paddingHorizontal: 28, paddingTop: 8 },
  back: { alignSelf: 'flex-start', marginBottom: 12, paddingVertical: 4 },
  backText: { color: colors.chalk, fontSize: 24 },
  block: { marginTop: 28 },
  email: { marginTop: 4 },
  signOut: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 28,
    paddingVertical: 16,
  },
  pressed: { opacity: 0.7 },
  signOutText: { color: colors.alert },
  divider: {
    backgroundColor: colors.line,
    height: StyleSheet.hairlineWidth,
    marginTop: 36,
  },
  attribution: { color: colors.dim, marginTop: 6 },
  link: { color: colors.dim, marginTop: 10, textDecorationLine: 'underline' },
  version: { color: colors.dim, marginTop: 36 },
  tmdbLogo: {
    height: 26,
    marginTop: 12,
    width: 146,
  },
});
