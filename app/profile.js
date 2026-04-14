import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    joined: 'April 2025',
  };

  const stats = {
    totalScanned: 12,
    recycled: 8,
    savedCO2: '2.4 kg',
  };

  const menuItems = [
    { icon: '✏️', title: 'Edit Profile', action: () => alert('Edit Profile') },
    { icon: '🗑️', title: 'Clear Scan History', action: () => handleClearHistory() },
    { icon: '♻️', title: 'Recycling Preferences', action: () => alert('Preferences') },
    {
      icon: '🔔',
      title: 'Notifications',
      toggle: true,
      value: notifications,
      action: () => setNotifications(!notifications),
    },
    { icon: '❓', title: 'Help & Support', action: () => alert('Help') },
    { icon: '📄', title: 'Privacy Policy', action: () => alert('Privacy') },
  ];

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all scan history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => alert('History cleared!'),
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'default',
        onPress: () => router.replace('/'),
      },
    ]);
  };

  const handleHome = () => {
    router.push('/home');
  };

  const handleHistory = () => {
    router.push('/history');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>👤</Text>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.joinDate}>Member since {user.joined}</Text>
          </View>

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Impact 🌍</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalScanned}</Text>
                <Text style={styles.statLabel}>Items Scanned</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.recycled}</Text>
                <Text style={styles.statLabel}>Recycled</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.savedCO2}</Text>
                <Text style={styles.statLabel}>CO₂ Saved</Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.action}
              >
                <View style={styles.menuLeft}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                <View style={styles.menuRight}>
                  {item.toggle ? (
                    <View
                      style={[
                        styles.toggle,
                        item.value && styles.toggleActive,
                      ]}
                    >
                      <View
                        style={[
                          styles.toggleDot,
                          item.value && styles.toggleDotActive,
                        ]}
                      />
                    </View>
                  ) : (
                    <Text style={styles.menuArrow}>›</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          {/* App Info */}
          <Text style={styles.appInfo}>Trash Tracker v1.0.0\nMade with 💚 for our planet</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleHome}>
          <View style={styles.navIconWrapper}>
            <Text style={styles.navIcon}>🏠</Text>
          </View>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconWrapper}>
            <Text style={styles.navIconActive}>⚙️</Text>
          </View>
          <Text style={styles.navTextActive}>Profile</Text>
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
  placeholder: {
    width: 28,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#E8F5E9',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 12,
    color: '#888',
  },
  statsCard: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
  menuRight: {},
  menuArrow: {
    fontSize: 20,
    color: '#888',
  },
  toggle: {
    width: 50,
    height: 28,
    backgroundColor: '#ddd',
    borderRadius: 14,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleDot: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  toggleDotActive: {
    marginLeft: 22,
  },
  logoutButton: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C62828',
  },
  appInfo: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
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
