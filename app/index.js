import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      router.replace('/home');
    } else {
      alert('Please enter email and password');
    }
  };

  const handleSignUp = () => {
    if (name && email && password && password === confirmPassword) {
      alert('Account created! Please login.');
      setIsSignUp(false);
    } else {
      alert('Please fill all fields correctly');
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
          <Text style={styles.title}>Trash Tracker</Text>
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
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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
            <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Login</Text>
            </TouchableOpacity>
          )}

          {!isSignUp && (
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.switchButton}
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
