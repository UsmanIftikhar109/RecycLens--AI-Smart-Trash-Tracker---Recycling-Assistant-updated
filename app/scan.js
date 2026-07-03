import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { apiPost } from './utils/api';

export default function ScanScreen() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const analyzeImage = async (asset) => {
    if (!asset.base64) {
      Alert.alert('Image unavailable', 'Please choose a different image and try again.');
      return;
    }

    setScanning(true);
    setSelectedImage(asset.uri);

    try {
      const response = await apiPost('/api/scans/analyze-image', {
        imageBase64: asset.base64,
        mimeType: asset.mimeType || 'image/jpeg',
      });

      const analysis = response.analysis || {};

      router.push({
        pathname: '/scan-result',
        params: {
          itemName: analysis.itemName || 'Unknown item',
          material: analysis.material || 'Mixed material',
          isRecyclable: String(Boolean(analysis.isRecyclable)),
          confidence: String(analysis.confidence ?? 0.5),
          icon: analysis.icon || '♻️',
          recyclingTip: analysis.recyclingTip || '',
          summary: analysis.summary || '',
          imageUri: asset.uri,
        },
      });
    } catch (error) {
      Alert.alert('Scan failed', error.message || 'Unable to analyze image');
    } finally {
      setScanning(false);
    }
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow photo access so RecycLens can scan your item image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    await analyzeImage(result.assets[0]);
  };

  return (
    <View style={styles.container}>
      {scanning ? (
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.scanningText}>Scanning your image</Text>
          <Text style={styles.scanningSubtext}>Gemini Flash is identifying the item and recycling tip...</Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Scan an Item Image</Text>
            <Text style={styles.subtitle}>Choose a photo and Gemini will identify how to recycle it</Text>
          </View>

          <ScrollView style={styles.itemsGrid} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.scanCard} onPress={handlePickImage} activeOpacity={0.8}>
              <Text style={styles.itemIcon}>📷</Text>
              <Text style={styles.itemName}>Choose Image</Text>
              <Text style={styles.cardText}>Tap here to pick a trash item from your gallery.</Text>
            </TouchableOpacity>

            {selectedImage ? (
              <View style={styles.previewCard}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                <Text style={styles.previewLabel}>Selected image</Text>
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Gemini Flash analyzes the image and returns a recycling tip.</Text>
            <Text style={styles.footerText}>No chatbot, only image-based scan results.</Text>
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
  content: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
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
  scanCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#4CAF50',
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  previewCard: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  previewLabel: {
    marginTop: 10,
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '600',
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
