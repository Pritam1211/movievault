import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../../components/AppText';
import { typography } from '../../../theme/typography';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

type Mode = 'signin' | 'signup';

export function AuthScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [mode, setMode] = useState<Mode>('signin');
  const [focusedInput, setFocusedInput] = useState<'email' | 'password' | null>(
    null,
  );
  const [error, setError] = useState<string | null>();
  const [busy, setBusy] = useState<boolean>(false);
  const isSignUp = mode === 'signup';

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    if (isSignUp && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError(null);
    setBusy(true);

    const credentials = { email: email.trim(), password };

    const { error: authError } = isSignUp
      ? await supabase.auth.signUp(credentials)
      : await supabase.auth.signInWithPassword(credentials);

    setBusy(false);

    if (authError) {
      setError(authError.message);
    }
  };

  const toggleMode = () => {
    setMode(mode => (mode === 'signin' ? 'signup' : 'signin'));
    setError(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.titleWrapper}>
          <AppText variant="display">MovieVault</AppText>
          <AppText variant="body" style={styles.subtitle}>
            Keep track of what you want to watch, and what you thought of it.
          </AppText>
        </View>
        <View>
          <AppText variant="label" style={styles.inputLabel}>
            Email
          </AppText>
          <TextInput
            placeholder="you@example.com"
            keyboardType="email-address"
            style={[
              typography.body,
              styles.input,
              focusedInput === 'email' && styles.inputFocused,
            ]}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
            placeholderTextColor={colors.dim}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            editable={!busy}
          />

          <AppText variant="label" style={styles.inputLabel}>
            Password
          </AppText>
          <TextInput
            placeholder="Password"
            style={[
              typography.body,
              styles.input,
              focusedInput === 'password' && styles.inputFocused,
            ]}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
            placeholderTextColor={colors.dim}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            onSubmitEditing={handleSignIn}
            editable={!busy}
          />
          {error && (
            <AppText variant="body" style={styles.errorText}>
              {error}
            </AppText>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              busy && styles.buttonDisabled,
            ]}
            onPress={handleSignIn}
            disabled={busy}
          >
            <AppText variant="strong" style={styles.buttonText}>
              {isSignUp ? 'Create Account' : 'Sign in'}
            </AppText>
          </Pressable>
          <Pressable
            onPress={toggleMode}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            disabled={busy}
          >
            <AppText variant="label" style={styles.footerText}>
              {isSignUp
                ? 'Already have an account? Sign in'
                : 'New here? Create Account'}
            </AppText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 32,
    paddingHorizontal: 28,
  },
  subtitle: {
    marginTop: 12,
    color: colors.dim,
    maxWidth: 200,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  inputLabel: {
    color: colors.dim,
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    color: colors.chalk,
    marginTop: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.raised,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 20,
  },
  inputFocused: {
    borderColor: colors.bulb,
  },
  inputError: {
    borderColor: colors.alert,
  },
  button: {
    backgroundColor: colors.bulb,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.ink,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    color: colors.dim,
    marginTop: 20,
  },
  errorText: {
    color: colors.alert,
    marginTop: 14,
  },
});
