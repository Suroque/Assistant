import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { signIn, signOut, signUp } from '@/src/lib/auth';
import { useSession } from '@/src/hooks/useSession';

export default function AuthScreen() {
  const { session, loading } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const showError = (err: any) => {
    const msg = err?.message ?? String(err);
    Alert.alert('Supabase error', msg);
  };

  const handleSignUp = async () => {
    try {
      const { error } = await signUp(email, password);
      if (error) return showError(error);
      Alert.alert('Signed up', 'Please check your email if confirmation is required.');
    } catch (err) {
      showError(err);
    }
  };

  const handleSignIn = async () => {
    try {
      const { error } = await signIn(email, password);
      if (error) return showError(error);
      Alert.alert('Signed in');
    } catch (err) {
      showError(err);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) return showError(error);
      Alert.alert('Signed out');
    } catch (err) {
      showError(err);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Supabase Auth Test</Text>

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <View style={styles.buttons}>
          <Button title="Sign up" onPress={handleSignUp} />
          <View style={styles.spacer} />
          <Button title="Sign in" onPress={handleSignIn} />
        </View>

        <View style={styles.signout}>
          <Button title="Sign out" color="red" onPress={handleSignOut} />
        </View>

        <View style={styles.status}>
          {loading ? (
            <Text>Loading session…</Text>
          ) : session ? (
            <Text>Logged in: {session.user?.email}</Text>
          ) : (
            <Text>Logged out</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
  },
  buttons: { flexDirection: 'row', alignItems: 'center' },
  spacer: { width: 12 },
  signout: { marginTop: 8 },
  status: { marginTop: 20 },
});
