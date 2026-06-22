import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiPost } from './utils/api';

export default function AITipsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'ai',
      text: 'Hello! I\'m your AI Recycling Assistant. How can I help you today?',
    },
  ]);
  const [sending, setSending] = useState(false);

  const quickQuestions = [
    'Is styrofoam recyclable?',
    'How do I recycle plastic?',
    'What is recyclable?',
    'How to reduce waste?',
  ];

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');

    // Add user message to chat
    setChatMessages((prev) => [...prev, { type: 'user', text: userMessage }]);

    setSending(true);
    try {
      const response = await apiPost('/api/tips/chat', { message: userMessage });
      setChatMessages((prev) => [...prev, { type: 'ai', text: response.message }]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { type: 'ai', text: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* AI Info Card */}
            <View style={styles.aiCard}>
              <Text style={styles.aiIcon}>🤖</Text>
              <Text style={styles.aiTitle}>AI Recycling Tips</Text>
              <Text style={styles.aiDescription}>
                Ask me anything about recycling! I can help you identify items, find recycling centers, and give tips on reusing items.
              </Text>
            </View>

            {/* Chat Section */}
            <Text style={styles.sectionTitle}>Chat with AI</Text>

            <View style={styles.chatContainer}>
              {chatMessages.map((msg, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBubble,
                    msg.type === 'ai' ? styles.aiMessage : styles.userMessage,
                  ]}
                >
                  <Text style={styles.messageIcon}>
                    {msg.type === 'ai' ? '🤖' : '👤'}
                  </Text>
                  <Text
                    style={[
                      styles.messageText,
                      msg.type === 'ai' ? styles.messageTextAi : styles.messageTextUser,
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              ))}
              {sending && (
                <View style={[styles.messageBubble, styles.aiMessage]}>
                  <Text style={styles.messageIcon}>🤖</Text>
                  <ActivityIndicator color="#666" />
                </View>
              )}
            </View>

            {/* Quick Questions */}
            <Text style={styles.sectionTitle}>Quick Questions</Text>

            <View style={styles.quickQuestions}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.questionChip}
                  onPress={() => handleQuickQuestion(question)}
                >
                  <Text style={styles.questionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Chat Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask the AI..."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
            multiline
            editable={!sending}
          />
          <TouchableOpacity
            style={[styles.sendButton, sending && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={sending}
          >
            {sending ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.sendIcon}>📤</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  aiCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  aiIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  chatContainer: {
    marginBottom: 24,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    maxWidth: '85%',
  },
  aiMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextAi: {
    color: '#333',
  },
  messageTextUser: {
    color: '#fff',
  },
  quickQuestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  questionChip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
    elevation: 1,
  },
  questionText: {
    fontSize: 13,
    color: '#4CAF50',
  },
  videoContainer: {
    marginBottom: 24,
  },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  videoThumbnail: {
    height: 120,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    fontSize: 40,
  },
  playButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  videoDuration: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 80,
  },
  sendButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    backgroundColor: '#4CAF50',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendIcon: {
    fontSize: 20,
  },
});
