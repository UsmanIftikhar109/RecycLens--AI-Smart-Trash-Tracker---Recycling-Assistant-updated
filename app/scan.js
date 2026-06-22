import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScanScreen() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState(null);

  // Sample items that can be "scanned"
  const items = [
    { id: 1, name: 'Plastic Bottle', material: 'Plastic', recyclable: true, icon: '🍾', confidence: 0.97 },
    { id: 2, name: 'Glass Jar', material: 'Glass', recyclable: true, icon: '🏺', confidence: 0.98 },
    { id: 3, name: 'Cardboard Box', material: 'Cardboard', recyclable: true, icon: '📦', confidence: 0.96 },
    { id: 4, name: 'Aluminum Can', material: 'Metal', recyclable: true, icon: '🥫', confidence: 0.99 },
    { id: 5, name: 'Styrofoam', material: 'Styrofoam', recyclable: false, icon: '⚪', confidence: 0.95 },
    { id: 6, name: 'Paper', material: 'Paper', recyclable: true, icon: '📄', confidence: 0.94 },
    { id: 7, name: 'Coffee Cup', material: 'Paper/Plastic', recyclable: false, icon: '☕', confidence: 0.92 },
    { id: 8, name: 'Electronics', material: 'Electronics', recyclable: true, icon: '⚡', confidence: 0.88 },
  ];

  const handleItemPress = async (item) => {
    setScanning(true);
    setScannedItem(item);

    // Simulate scanning delay
    setTimeout(() => {
      setScanning(false);
      // Navigate to scan result with item data
      router.push({
        pathname: '/scan-result',
        params: {
          itemName: item.name,
          material: item.material,
          isRecyclable: item.recyclable.toString(),
          confidence: item.confidence.toString(),
          icon: item.icon,
        },
      });
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {scanning ? (
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.scanningText}>Scanning: {scannedItem?.name}</Text>
          <Text style={styles.scanningSubtext}>Analyzing material...</Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Select Item to Scan</Text>
            <Text style={styles.subtitle}>Tap an item to simulate scanning</Text>
          </View>

          <ScrollView style={styles.itemsGrid} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.itemCard,
                    item.recyclable ? styles.recyclable : styles.nonRecyclable,
                  ]}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.recycleIndicator}>
                    <Text style={styles.recycleText}>
                      {item.recyclable ? '♻️ Yes' : '✗ No'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>This is a simulated scan.</Text>
            <Text style={styles.footerText}>In production, this would use real camera + ML model.</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  itemsGrid: {
    flex: 1,
    paddingHorizontal: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  itemCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  recyclable: {
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  nonRecyclable: {
    backgroundColor: '#ffebee',
    borderWidth: 2,
    borderColor: '#f44336',
  },
  itemIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  recycleIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  recycleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 20,
  },
  scanningSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginVertical: 2,
  },
});
