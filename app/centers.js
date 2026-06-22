import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiGet } from './utils/api';

export default function CentersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch centers from API
  const fetchCenters = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet('/api/centers');
      setCenters(data.centers || []);
    } catch (error) {
      console.error('Error fetching centers:', error);
      setCenters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCenters();
    }, [fetchCenters])
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCenters = centers.filter((center) => {
    if (!normalizedQuery) return true;
    return (
      center.name?.toLowerCase().includes(normalizedQuery) ||
      center.address?.toLowerCase().includes(normalizedQuery) ||
      center.accepts?.join(' ').toLowerCase().includes(normalizedQuery)
    );
  });

  const handleCall = (phone) => {
    if (!phone) {
      alert('No phone number available');
      return;
    }
    const telUrl = `tel:${phone}`;
    Linking.openURL(telUrl).catch(() => {
      alert('Unable to open dialer on this device.');
    });
  };

  const handleDirections = (address) => {
    if (!address) {
      alert('No address available');
      return;
    }
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    Linking.openURL(mapsUrl).catch(() => {
      alert('Unable to open maps on this device.');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recycling Centers</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Map View Placeholder */}
          <View style={styles.mapContainer}>
            <Text style={styles.mapIcon}>🗺️</Text>
            <Text style={styles.mapText}>Map View</Text>
            <Text style={styles.mapSubtext}>Showing centers near you</Text>

            {/* Map Pins */}
            <View style={styles.pinContainer}>
              <Text style={styles.mapPin}>📍</Text>
              <Text style={styles.mapPin2}>📍</Text>
              <Text style={styles.mapPin3}>📍</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search recycling centers..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Centers List */}
          <Text style={styles.listTitle}>Nearby Centers</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" style={{ marginVertical: 40 }} />
          ) : filteredCenters.length > 0 ? (
            <View style={styles.centersList}>
              {filteredCenters.map((center, index) => (
                <View key={index} style={styles.centerCard}>
                  <View style={styles.centerHeader}>
                    <Text style={styles.centerName}>{center.name}</Text>
                    <View style={styles.distanceBadge}>
                      <Text style={styles.distanceText}>
                        {center.distance ? `${center.distance.toFixed(1)} km` : 'N/A'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.centerAddress}>{center.address}</Text>

                  <View style={styles.acceptsContainer}>
                  <Text style={styles.acceptsLabel}>Accepts: </Text>
                  <Text style={styles.acceptsText}>
                    {center.accepts.join(', ')}
                  </Text>
                </View>

                <View style={styles.centerActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCall(center.phone)}
                  >
                    <Text style={styles.actionText}>📞 Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.directionsButton}
                    onPress={() => handleDirections(center.address)}
                  >
                    <Text style={styles.directionsText}>🧭 Directions</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.statusContainer}>
                  <Text style={center.isOpen ? styles.openStatus : styles.closedStatus}>
                    {center.isOpen ? '🟢 Open Now' : '🔴 Closed'}
                  </Text>
                </View>
              </View>
            ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏢</Text>
              <Text style={styles.emptyText}>No centers found</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    color: '#fff',
    fontSize: 20,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
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
    paddingBottom: 40,
  },
  mapContainer: {
    height: 200,
    backgroundColor: '#C8E6C9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  mapSubtext: {
    fontSize: 14,
    color: '#558B2F',
  },
  pinContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  mapPin: {
    position: 'absolute',
    fontSize: 32,
    left: '30%',
    top: '30%',
  },
  mapPin2: {
    position: 'absolute',
    fontSize: 32,
    right: '30%',
    top: '40%',
  },
  mapPin3: {
    position: 'absolute',
    fontSize: 32,
    left: '50%',
    bottom: '25%',
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
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  centersList: {
    marginBottom: 16,
  },
  centerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  centerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  centerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  distanceBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  distanceText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  centerAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  acceptsContainer: {
    marginBottom: 12,
  },
  acceptsLabel: {
    fontSize: 13,
    color: '#888',
  },
  acceptsText: {
    fontSize: 13,
    color: '#4CAF50',
  },
  centerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 13,
    color: '#555',
  },
  directionsButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  directionsText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  statusContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  openStatus: {
    fontSize: 13,
    color: '#4CAF50',
  },
  closedStatus: {
    fontSize: 13,
    color: '#E57373',
  },
  emptyState: {
    alignItems: 'center',
    marginVertical: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
