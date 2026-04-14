import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Scan line animation
  useEffect(() => {
    const scanAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    scanAnim.start();
    return () => scanAnim.stop();
  }, []);

  // Pulse animation for the button
  useEffect(() => {
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnim.start();
    return () => pulseAnim.stop();
  }, []);

  const handleScan = () => {
    router.push('/scan-result');
  };

  const handleHistory = () => {
    router.push('/history');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trash Tracker</Text>
        <TouchableOpacity onPress={handleProfile}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Main Content */}
        <View style={styles.content}>
          {/* App Title and Subtitle */}
          <View style={styles.titleContainer}>
            <Image
              source={require('../assets/images/Logo.png.jpg')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>Scan your trash. Recycle smart.</Text>
          </View>

          {/* Big Scan Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
            <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
              <View style={styles.scanButtonInner}>
                <View style={styles.scanIconContainer}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={45}
                    color="#4CAF50"
                  />
                  <Animated.View
                    style={[
                      styles.scanLine,
                      {
                        transform: [
                          {
                            translateY: scanAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-25, 25],
                            }),
                          },
                        ],
                        opacity: scanAnimation.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.3, 1, 0.3],
                        }),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.scanButtonText}>SCAN TRASH</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Items Scanned</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Recycled</Text>
            </View>
          </View>

          {/* Quick Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>🗑️</Text>
              <Text style={styles.tipText}>Separate plastic, glass, and paper</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>♻️</Text>
              <Text style={styles.tipText}>Clean items before recycling</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>🌍</Text>
              <Text style={styles.tipText}>Every item counts for our planet</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconWrapper}>
            <Text style={styles.navIconActive}>🏠</Text>
          </View>
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleScan}>
          <View style={styles.navIconWrapper}>
            <MaterialCommunityIcons name="camera" size={24} color="#666" />
          </View>
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleHistory}>
          <View style={styles.navIconWrapper}>
            <Text style={styles.navIcon}>📋</Text>
          </View>
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleProfile}>
          <View style={styles.navIconWrapper}>
            <Text style={styles.navIcon}>⚙️</Text>
          </View>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4CAF50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileIcon: {
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#558B2F',
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 100,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 32,
  },
  scanButtonInner: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    width: 60,
    height: 3,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: 140,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tipsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#33691E',
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIconWrapper: {
    height: 28,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navIcon: {
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
  },
  navIconActive: {
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
    color: '#4CAF50',
  },
  navText: {
    fontSize: 12,
    color: '#666',
  },
  navTextActive: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
