import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { aiAPI } from '../../services/api';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/theme';

export default function AIAdvisorScreen() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isDark } = useTheme();
  const { strings } = useLanguage();

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = { type: 'user', text: question };
    setConversation(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await aiAPI.chatWithAI(question);
      const aiMessage = { type: 'ai', text: response.data.response };
      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { type: 'ai', text: strings.error };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}
    >
      <ScrollView style={styles.chatContainer}>
        {conversation.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bulb-outline" size={64} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} />
            <Text style={[styles.emptyText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
              {strings.askQuestion}
            </Text>
          </View>
        ) : (
          conversation.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageCard,
                message.type === 'user' ? styles.userMessage : styles.aiMessage,
                isDark && (message.type === 'ai' ? styles.cardDark : {}),
              ]}
            >
              <Text style={[
                styles.messageText,
                { color: message.type === 'user' ? '#fff' : (isDark ? Colors.textDark : Colors.text) }
              ]}>
                {message.text}
              </Text>
            </View>
          ))
        )}
        {loading && (
          <View style={[styles.messageCard, styles.aiMessage, isDark && styles.cardDark]}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
        <TextInput
          style={[styles.input, { color: isDark ? Colors.textDark : Colors.text }]}
          placeholder={strings.questionPlaceholder}
          placeholderTextColor={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
          value={question}
          onChangeText={setQuestion}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.buttonDisabled]}
          onPress={handleAsk}
          disabled={loading}
        >
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: Typography.h5,
    marginTop: Spacing.md,
  },
  messageCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: Colors.cardBackground,
    alignSelf: 'flex-start',
    ...Shadows.sm,
  },
  cardDark: {
    backgroundColor: Colors.cardBackgroundDark,
  },
  messageText: {
    fontSize: Typography.body,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputContainerDark: {
    backgroundColor: Colors.cardBackgroundDark,
    borderTopColor: Colors.borderDark,
  },
  input: {
    flex: 1,
    fontSize: Typography.body,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
