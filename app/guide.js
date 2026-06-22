import React from 'react';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GuideScreen() {
  const router = useRouter();

  const steps = [
    {
      number: '1',
      icon: '🧽',
      title: 'Clean the Item',
      description: 'Rinse the plastic bottle to remove any liquids or food residue.',
    },
    {
      number: '2',
      icon: '🏷️',
      title: 'Remove Labels',
      description: 'Peel off any paper or plastic labels from the bottle.',
    },
    {
      number: '3',
      icon: '🗑️',
      title: 'Put in Recycling Bin',
      description: 'Place the clean bottle in your recycling bin or take it to a recycling center.',
    },
  ];

  const reuseIdeas = [
    { icon: '🌱', title: 'Plant Pot', description: 'Use as a small planter for herbs' },
    { icon: '🎨', title: 'Craft Project', description: 'Cut and decorate for art projects' },
    { icon: '📦', title: 'Storage', description: 'Store small items like screws or buttons' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How to Recycle</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Item Info */}
          <View style={styles.itemCard}>
            <Text style={styles.itemIcon}>🥤</Text>
            <Text style={styles.itemName}>Plastic Bottle</Text>
            <Text style={styles.itemMaterial}>Material: PET Plastic</Text>
          </View>

          {/* Steps Title */}
          <Text style={styles.sectionTitle}>Step-by-Step Guide</Text>

          {/* Steps */}
          <View style={styles.stepsContainer}>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepIcon}>{step.icon}</Text>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Reuse Ideas */}
          <Text style={styles.sectionTitle}>Reuse Ideas 💡</Text>

          <View style={styles.reuseContainer}>
            {reuseIdeas.map((idea, index) => (
              <View key={index} style={styles.reuseCard}>
                <Text style={styles.reuseIcon}>{idea.icon}</Text>
                <Text style={styles.reuseTitle}>{idea.title}</Text>
                <Text style={styles.reuseDescription}>{idea.description}</Text>
              </View>
            ))}
          </View>

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.doneButtonText}>Got It! 👍</Text>
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
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemIcon: {
    fontSize: 60,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemMaterial: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  stepsContainer: {
    marginBottom: 24,
  },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepNumber: {
    width: 36,
    height: 36,
    backgroundColor: '#4CAF50',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  reuseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  reuseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  reuseIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  reuseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  reuseDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
