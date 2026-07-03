import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiPost } from './utils/api';

export default function ScanResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [saving, setSaving] = useState(false);

  // Get scan data from route params or use defaults
  const scanResult = {
    itemName: params.itemName || 'Plastic Bottle',
    isRecyclable: params.isRecyclable === 'true',
    material: params.material || 'Plastic (PET)',
    confidence: parseFloat(params.confidence) || 0.95,
    icon: params.icon || '🥤',
    recyclingTip: params.recyclingTip || 'Clean the item and follow your local recycling rules.',
    summary: params.summary || '',
    imageUri: params.imageUri || null,
  };

  const handleHowToRecycle = () => {
    router.push({
      pathname: '/guide',
      params: { itemType: scanResult.material },
    });
  };

  const handleScanAnother = () => {
    router.replace('/scan');
  };

  const handleClose = () => {
    router.push('/home');
  };

  const handleFindCenters = () => {
    router.push({
      pathname: '/centers',
      params: { material: scanResult.material },
    });
  };

  const handleMarkAsRecycled = async () => {
    setSaving(true);
    try {
      const result = await apiPost('/api/scans', {
        itemName: scanResult.itemName,
        material: scanResult.material,
        isRecyclable: scanResult.isRecyclable,
        confidence: scanResult.confidence,
        icon: scanResult.icon,
      });

      // Navigate to success screen with the saved scan data
      router.push({
        pathname: '/success',
        params: {
          scanId: result.scan._id,
          itemName: scanResult.itemName,
          isRecyclable: scanResult.isRecyclable,
        },
      });
    } catch (error) {
      alert('Error saving scan: ' + error.message);
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Result</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Item Image Placeholder */}
          <View style={styles.imageContainer}>
            {scanResult.imageUri ? (
              <View style={styles.previewWrap}>
                <Text style={styles.previewEmoji}>{scanResult.icon}</Text>
                <Text style={styles.previewLabel}>Image scanned</Text>
              </View>
            ) : (
              <Text style={styles.itemIcon}>{scanResult.icon}</Text>
            )}
            <Text style={styles.itemName}>{scanResult.itemName}</Text>
          </View>

          {/* Recyclable Status */}
          <View style={styles.statusContainer}>
            {scanResult.isRecyclable ? (
              <View style={styles.statusBoxRecyclable}>
                <Text style={styles.statusIcon}>✅</Text>
                <Text style={styles.statusText}>Recyclable!</Text>
              </View>
            ) : (
              <View style={styles.statusBoxNotRecyclable}>
                <Text style={styles.statusIcon}>❌</Text>
                <Text style={styles.statusText}>Not Recyclable</Text>
              </View>
            )}
          </View>

          {/* Material Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Material Type</Text>
            <Text style={styles.infoValue}>{scanResult.material}</Text>

            <View style={styles.divider} />

            <Text style={styles.infoLabel}>Confidence</Text>
            <Text style={styles.infoValue}>{Math.round(scanResult.confidence * 100)}%</Text>

            <View style={styles.divider} />

            <Text style={styles.infoLabel}>Gemini Tip</Text>
            <Text style={styles.tipText}>{scanResult.recyclingTip}</Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={[styles.primaryButton, saving && styles.buttonDisabled]}
            onPress={handleMarkAsRecycled}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>✅ Mark as Recycled</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleHowToRecycle}>
            <Text style={styles.secondaryButtonText}>📖 How to Recycle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.aiButton} onPress={handleScanAnother}>
            <Text style={styles.aiButtonText}>📷 Scan Another Image</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tertiaryButton} onPress={handleFindCenters}>
            <Text style={styles.tertiaryButtonText}>📍 Find Recycling Centers</Text>
          </TouchableOpacity>

          {/* Info Note */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteIcon}>💡</Text>
            <Text style={styles.noteText}>
              Make sure to clean the item before recycling!
            </Text>
          </View>
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
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  imageContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  itemIcon: {
    fontSize: 80,
    marginBottom: 8,
  },
  previewWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusContainer: {
    marginBottom: 24,
  },
  statusBoxRecyclable: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusBoxNotRecyclable: {
    backgroundColor: '#E57373',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  aiButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  tertiaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  noteIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
});
