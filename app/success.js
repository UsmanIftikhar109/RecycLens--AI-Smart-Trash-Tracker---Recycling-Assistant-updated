import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SuccessScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleContinue = () => {
    router.push('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.globeIcon}>🌍</Text>
          <View style={styles.checkCircle}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        </View>

        <Text style={styles.title}>Great Job! 🎉</Text>
        <Text style={styles.message}>You helped save the planet!</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>♻️</Text>
            <Text style={styles.statLabel}>Item Recycled</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statLabel}>+10 Points</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🌱</Text>
            <Text style={styles.statLabel}>CO₂ Saved</Text>
          </View>
        </View>

        <View style={styles.badgeContainer}>
          <Text style={styles.badgeIcon}>🏅</Text>
          <Text style={styles.badgeTitle}>Eco Warrior</Text>
          <Text style={styles.badgeSubtitle}>Badge Earned!</Text>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue →</Text>
        </TouchableOpacity>

        <Text style={styles.autoRedirect}>Redirecting to home in 3 seconds...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  globeIcon: {
    fontSize: 120,
  },
  checkCircle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E8F5E9',
  },
  checkIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  message: {
    fontSize: 18,
    color: '#558B2F',
    textAlign: 'center',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: 100,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  badgeContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#FFD54F',
    width: '80%',
  },
  badgeIcon: {
    fontSize: 60,
    marginBottom: 8,
  },
  badgeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 4,
  },
  badgeSubtitle: {
    fontSize: 14,
    color: '#FFB300',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    elevation: 2,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  autoRedirect: {
    marginTop: 24,
    fontSize: 14,
    color: '#888',
  },
});
