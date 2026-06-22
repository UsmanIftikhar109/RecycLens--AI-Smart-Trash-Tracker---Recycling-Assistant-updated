import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiPost, getToken } from './utils/api';
import { useAuth } from './utils/auth-context';

const getErrorFromResponse = async (response) => {
  try {
    const json = await response.json();
    if (json?.error) {
      return json.error;
    }
  } catch {
    // Ignore JSON parsing errors and fallback to generic status text.
  }

  return response.statusText || 'Request failed';
};

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkExistingLogin = async () => {
      const token = await getToken();
      if (token && isLoggedIn) {
        router.replace('/home');
      }
      setCheckingAuth(false);
    };
    checkExistingLogin();
  }, [isLoggedIn, router]);

  if (checkingAuth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const isGmail = (value) => /@gmail\.com$/i.test(value.trim());

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Please enter email and password');
      return;
    }
    if (!isGmail(email)) {
      alert('Please enter a valid Gmail address');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await apiPost('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      if (!data?.token) {
        throw new Error('Login failed: token missing from server response');
      }

      // Store token and user data in auth context
      await login(data.user, data.token);
      router.replace('/home');
    } catch (error) {
      alert(error.message || 'Unable to login right now');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert('Please fill all fields correctly');
      return;
    }
    if (!isGmail(email)) {
      alert('Please enter a valid Gmail address');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiPost('/api/auth/register', {
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      alert('Account created! Please login.');
      setIsSignUp(false);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert(error.message || 'Unable to create account right now');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/Logo.png.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>RecycLens</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Create your account' : 'Recycle smarter, every day'}
          </Text>
        </View>

        <View style={styles.form}>
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Gmail address"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          )}

          {isSignUp ? (
            <TouchableOpacity
              style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
              onPress={handleSignUp}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Login</Text>
              )}
            </TouchableOpacity>
          )}

          {!isSignUp && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/forgot-password')}
            >
              <Text style={styles.secondaryButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.switchButton}
            disabled={isSubmitting}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.switchButtonText}>
              {isSignUp
                ? 'Already have an account? Log in'
                : 'Create New Account'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Made with 💚 for our planet</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoImage: {
    width: 140,
    height: 140,
    marginBottom: 16,
    borderRadius: 70,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#558B2F',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 320,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#388E3C',
    fontSize: 14,
  },
  switchButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  switchButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    marginTop: 48,
    color: '#66BB6A',
    fontSize: 14,
  },
});
