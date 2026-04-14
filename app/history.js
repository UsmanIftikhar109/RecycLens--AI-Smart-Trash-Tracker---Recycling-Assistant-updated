import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('All'); // All, Recyclable, Not Recyclable
  const [searchQuery, setSearchQuery] = useState('');

  const scanHistory = [
    {
      id: 1,
      itemName: 'Plastic Bottle',
      icon: '🥤',
      isRecyclable: true,
      material: 'PET Plastic',
      date: 'Today, 2:30 PM',
    },
    {
      id: 2,
      itemName: 'Cardboard Box',
      icon: '📦',
      isRecyclable: true,
      material: 'Cardboard',
      date: 'Yesterday, 5:15 PM',
    },
    {
      id: 3,
      itemName: 'Coffee Cup',
      icon: '☕',
      isRecyclable: false,
      material: 'Mixed Material',
      date: 'Yesterday, 9:00 AM',
    },
    {
      id: 4,
      itemName: 'Glass Jar',
      icon: '🫙',
      isRecyclable: true,
      material: 'Glass',
      date: 'Apr 10, 3:45 PM',
    },
    {
      id: 5,
      itemName: 'Styrofoam Plate',
      icon: '🍽️',
      isRecyclable: false,
      material: 'Styrofoam',
      date: 'Apr 9, 7:20 PM',
    },
  ];

  const filteredHistory = scanHistory.filter((item) => {
    if (filter === 'Recyclable') return item.isRecyclable;
    if (filter === 'Not Recyclable') return !item.isRecyclable;
    return true;
  });

  const handleItemPress = (item) => {
    router.push({
      pathname: '/history-detail',
      params: { id: item.id },
    });
  };

  const handleHome = () => {
    router.push('/home');
  };

  const handleScan = () => {
    router.push('/scan-result');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan History</Text>
        <TouchableOpacity onPress={handleProfile}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search history..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            {['All', 'Recyclable', 'Not Recyclable'].map((filterOption) => (
              <TouchableOpacity
                key={filterOption}
                style={[
                  styles.filterButton,
                  filter === filterOption && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(filterOption)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === filterOption && styles.filterTextActive,
                  ]}
                >
                  {filterOption === 'Recyclable' && '♻️ '}
                  {filterOption === 'Not Recyclable' && '❌ '}
                  {filterOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{scanHistory.length}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: '#4CAF50' }]}>
                {scanHistory.filter((i) => i.isRecyclable).length}
              </Text>
              <Text style={styles.statLabel}>Recyclable</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: '#E57373' }]}>
                {scanHistory.filter((i) => !i.isRecyclable).length}
              </Text>
              <Text style={styles.statLabel}>Not Recyclable</Text>
            </View>
          </View>

          {/* History List */}
          <View style={styles.historyList}>
            <Text style={styles.listTitle}>Recent Scans</Text>

            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.historyCard}
                  onPress={() => handleItemPress(item)}
                >
                  <View style={styles.cardLeft}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.itemIcon}>{item.icon}</Text>
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.itemName}</Text>
                      <Text style={styles.itemMaterial}>{item.material}</Text>
                      <Text style={styles.itemDate}>{item.date}</Text>
                    </View>
                  </View>

                  <View style={styles.cardRight}>
                    <Text style={styles.statusIcon}>
                      {item.isRecyclable ? '✅' : '❌'}
                    </Text>
                    <Text
                      style={[
                        styles.statusText,
                        item.isRecyclable
                          ? styles.recyclableText
                          : styles.notRecyclableText,
                      ]}
                    >
                      {item.isRecyclable ? 'Yes' : 'No'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📋</Text>
                <Text style={styles.emptyText}>No items found</Text>
              </View>
            )}
          </View>
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
        <TouchableOpacity style={styles.navItem} onPress={handleScan}>
          <View style={styles.navIconWrapper}>
            <MaterialCommunityIcons name="camera" size={24} color="#666" />
          </View>
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconWrapper}>
            <Text style={styles.navIconActive}>📋</Text>
          </View>
          <Text style={styles.navTextActive}>History</Text>
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
    padding: 16,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 13,
    color: '#555',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: 100,
    alignItems: 'center',
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  historyList: {
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemIcon: {
    fontSize: 28,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemMaterial: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
  cardRight: {
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recyclableText: {
    color: '#4CAF50',
  },
  notRecyclableText: {
    color: '#E57373',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
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
