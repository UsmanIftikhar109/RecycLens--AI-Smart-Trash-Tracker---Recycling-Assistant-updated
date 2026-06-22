import { useRouter } from 'expo-router';
import { useState } from 'react';
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
import { apiPost } from './utils/api';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [step, setStep] = useState(1); // Step 1: request token, Step 2: enter token & reset

  const handleForgot = async () => {
    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setIsError(false);

    try {
      const response = await apiPost('/api/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });

      // Development: token is returned in response
      if (response.token) {
        setToken(response.token);
        setMessage(`Token created: ${response.token}`);
        setStep(2);
      } else {
        setMessage('Password reset email sent! Please check your inbox.');
        setStep(2);
      }
    } catch (error) {
      setIsError(true);
      setMessage(error.message || 'Unable to process reset request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!token.trim()) {
      alert('Please enter or paste the reset token');
      return;
    }

    router.push({
      pathname: '/reset-password',
      params: { token }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Image
            source={require('../assets/images/Logo.png.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            {step === 1 
              ? 'Enter your email to receive a password reset token'
              : 'Use the token to reset your password'}
          </Text>
        </View>

        <View style={styles.form}>
          {step === 1 ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
              />

              <TouchableOpacity
                style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
                onPress={handleForgot}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Send Reset Token</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Reset token (paste here)"
                placeholderTextColor="#888"
                value={token}
                onChangeText={setToken}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleResetPassword}
              >
                <Text style={styles.primaryButtonText}>Continue to Reset Password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setStep(1);
                  setEmail('');
                  setToken('');
                  setMessage(null);
                }}
              >
                <Text style={styles.secondaryButtonText}>Request New Token</Text>
              </TouchableOpacity>
            </>
          )}

          {message && (
            <View style={styles.messageContainer}>
              <Text style={[styles.message, isError ? styles.errorText : styles.successText]}>
                {message}
              </Text>
            </View>
          )}
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 48,
    width: '100%',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#388E3C',
    fontSize: 16,
    fontWeight: '500',
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 60,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
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
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  messageContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  message: {
    textAlign: 'center',
    fontSize: 14,
  },
  successText: {
    color: '#2E7D32',
  },
  errorText: {
    color: '#C62828',
  },
});