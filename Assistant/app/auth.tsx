import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
  Pressable,
} from 'react-native';

import { signIn, signOut, signUp } from '@/src/lib/auth';
import { useSession } from '@/src/hooks/useSession';

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

function isValidEmail(email: string) {
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
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return null;
    }
    return { e, p };
  };

  const onSignUp = async () => {
    const v = requireValidInputs();
    if (!v) return;

    const { error } = await signUp(v.e, v.p);
    if (error) return Alert.alert('Sign up error', error.message);

    Alert.alert('Sign up', 'If email confirmation is enabled, check your inbox.');
  };

  const onSignIn = async () => {
    const v = requireValidInputs();
    if (!v) return;

    const { error } = await signIn(v.e, v.p);
    if (error) return Alert.alert('Sign in error', error.message);
  };

  const onSignOut = async () => {
    const { error } = await signOut();
    if (error) Alert.alert('Sign out error', error.message);
  };

  const bg = isDark ? '#000000' : '#ffffff';
  const fg = isDark ? '#ffffff' : '#000000';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 24, fontWeight: '700', color: fg }}>Auth</Text>

        <Text style={{ color: fg }}>
          Status:{' '}
          {loading
            ? 'Loading...'
            : session
            ? `Logged in: ${session.user.email ?? '(no email)'}`
            : 'Logged out'}
        </Text>

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
          <Text style={{ color: fg, fontWeight: '600' }}>Sign up</Text>
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
          <Text style={{ color: fg, fontWeight: '600' }}>Sign in</Text>
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
          <Text style={{ color: fg, fontWeight: '600' }}>Sign out</Text>
        </Pressable>

        <Text style={{ color: fg, opacity: 0.7 }}>Route: /auth</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}