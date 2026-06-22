import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const item = {
    id: id || 1,
    name: 'Plastic Bottle',
    icon: '🥤',
    isRecyclable: true,
    material: 'PET Plastic',
    date: 'April 12, 2025 at 2:30 PM',
    location: 'New York, NY',
    description:
      'This is a plastic beverage bottle made from PET (Polyethylene Terephthalate). It is widely recyclable.',
  };

  const handleViewGuide = () => {
    router.push('/guide');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            alert('Item deleted!');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Item Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Text style={styles.itemIcon}>{item.icon}</Text>
            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>Scanned</Text>
            </View>
          </View>

          <Text style={styles.itemName}>{item.name}</Text>

          <View
            style={[
              styles.statusBadge,
              item.isRecyclable
                ? styles.recyclableBadge
                : styles.notRecyclableBadge,
            ]}
          >
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
              {item.isRecyclable ? 'Recyclable' : 'Not Recyclable'}
            </Text>
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Material Type</Text>
              <Text style={styles.detailValue}>{item.material}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date Scanned</Text>
              <Text style={styles.detailValue}>{item.date}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{item.location}</Text>
            </View>
          </View>

          <View style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>About this Item</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>

          <TouchableOpacity style={styles.guideButton} onPress={handleViewGuide}>
            <Text style={styles.guideButtonText}>📖 View Recycling Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>🗑️ Delete from History</Text>
          </TouchableOpacity>
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
    fontSize: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 50,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  imageContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    elevation: 4,
    position: 'relative',
  },
  itemIcon: {
    fontSize: 100,
  },
  imageBadge: {
    position: 'absolute',
    bottom: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  imageBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  itemName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  recyclableBadge: {
    backgroundColor: '#E8F5E9',
  },
  notRecyclableBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recyclableText: {
    color: '#4CAF50',
  },
  notRecyclableText: {
    color: '#E57373',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  guideButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  guideButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  deleteButtonText: {
    color: '#C62828',
    fontSize: 16,
    fontWeight: '600',
  },
});
