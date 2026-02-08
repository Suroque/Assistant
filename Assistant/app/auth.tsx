import { useMemo, useState } from 'react';
import { Alert, Pressable, TextInput, useColorScheme } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { signIn, signOut, signUp } from '@/src/lib/auth';
import { useSession } from '@/src/hooks/useSession';

function normalizeEmail(raw: string) {
  // Supabase часто ругается на пробелы/невидимые символы
  return raw.trim().toLowerCase();
}

function isValidEmail(email: string) {
  // Простая практичная проверка (достаточно для UI)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AuthScreen() {
  const { session, loading } = useSession();

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const inputStyle = useMemo(
    () => ({
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderColor: isDark ? '#3a3a3a' : '#d0d0d0',
      backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
    }),
    [isDark]
  );

  const placeholderTextColor = isDark ? '#8e8e93' : '#6b7280';

  const requireValidInputs = () => {
    const e = normalizeEmail(email);
    const p = password;

    if (!e || !p) {
      Alert.alert('Missing data', 'Please enter email and password.');
      return null;
    }
    if (!isValidEmail(e)) {
      Alert.alert('Invalid email', 'Please enter a valid email like name@example.com.');
      return null;
    }
    if (p.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters (Supabase default).');
      return null;
    }
    return { e, p };
  };

  const onSignUp = async () => {
    const v = requireValidInputs();
    if (!v) return;

    const { error } = await signUp(v.e, v.p);
    if (error) {
      Alert.alert('Sign up error', error.message);
      return;
    }

    Alert.alert(
      'Sign up',
      'Sign-up request sent. If email confirmation is enabled in Supabase, check your inbox.'
    );
  };

  const onSignIn = async () => {
    const v = requireValidInputs();
    if (!v) return;

    const { error } = await signIn(v.e, v.p);
    if (error) {
      Alert.alert('Sign in error', error.message);
      return;
    }
  };

  const onSignOut = async () => {
    const { error } = await signOut();
    if (error) Alert.alert('Sign out error', error.message);
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16, gap: 14 }}>
      <ThemedText type="title">Auth</ThemedText>

      <ThemedText>
        Status:{' '}
        {loading
          ? 'Loading...'
          : session
          ? `Logged in: ${session.user.email ?? '(no email)'}`
          : 'Logged out'}
      </ThemedText>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={placeholderTextColor}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        style={inputStyle}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={placeholderTextColor}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        textContentType="password"
        autoComplete="password"
        style={inputStyle}
      />

      <Pressable
        onPress={onSignUp}
        style={{
          borderRadius: 10,
          paddingVertical: 12,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: isDark ? '#3a3a3a' : '#d0d0d0',
        }}
      >
        <ThemedText type="defaultSemiBold">Sign up</ThemedText>
      </Pressable>

      <Pressable
        onPress={onSignIn}
        style={{
          borderRadius: 10,
          paddingVertical: 12,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: isDark ? '#3a3a3a' : '#d0d0d0',
        }}
      >
        <ThemedText type="defaultSemiBold">Sign in</ThemedText>
      </Pressable>

      <Pressable
        onPress={onSignOut}
        style={{
          borderRadius: 10,
          paddingVertical: 12,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: isDark ? '#3a3a3a' : '#d0d0d0',
        }}
      >
        <ThemedText type="defaultSemiBold">Sign out</ThemedText>
      </Pressable>

      <ThemedText style={{ marginTop: 8 }}>
        Back to home: <Link href="/">(open)</Link>
      </ThemedText>
    </ThemedView>
  );
}