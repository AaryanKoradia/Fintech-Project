import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { expensesAPI, aiAPI } from '../../services/api';
import { formatCurrency } from '../../utils/storage';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/theme';

export default function ExpenseTrackerScreen({ navigation }) {
  const [expenses, setExpenses] = useState([]);
  const [aiPlan, setAiPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'Food',
    amount: '',
    description: '',
  });

  const { isDark } = useTheme();
  const { strings, currentLanguage } = useLanguage();

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const [expensesRes, aiRes] = await Promise.all([
        expensesAPI.getExpenses(),
        aiAPI.getFinancialPlan({ monthly_income: 10000, monthly_expenses: 7000 }),
      ]);
      setExpenses(expensesRes.data);
      setAiPlan(aiRes.data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.amount || !newExpense.description) {
      Alert.alert('Error', strings.validationError);
      return;
    }

    try {
      await expensesAPI.addExpense({
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        date: new Date().toISOString(),
      });
      setModalVisible(false);
      setNewExpense({ category: 'Food', amount: '', description: '' });
      loadExpenses();
    } catch (error) {
      Alert.alert('Error', strings.error);
    }
  };

  const handleListen = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else if (aiPlan?.aiAdvice) {
      const language = currentLanguage === 'hindi' ? 'hi-IN' : 'en-US';
      Speech.speak(aiPlan.aiAdvice, {
        language,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
      <ScrollView>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, isDark ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.summaryLabel, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
              {strings.totalExpenses}
            </Text>
            <Text style={[styles.summaryValue, { color: Colors.error }]}>
              {formatCurrency(totalExpenses)}
            </Text>
          </View>
        </View>

        {/* Expenses List */}
        <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
          {strings.language === 'hindi' ? 'हाल के खर्च' : 'Recent Expenses'}
        </Text>
        {expenses.map((expense, index) => (
          <View key={index} style={[styles.expenseCard, isDark ? styles.cardDark : styles.cardLight]}>
            <View style={styles.expenseInfo}>
              <Text style={[styles.expenseCategory, { color: isDark ? Colors.textDark : Colors.text }]}>
                {expense.category}
              </Text>
              <Text style={[styles.expenseDescription, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
                {expense.description}
              </Text>
            </View>
            <Text style={[styles.expenseAmount, { color: Colors.error }]}>
              {formatCurrency(expense.amount)}
            </Text>
          </View>
        ))}

        {/* AI Financial Advice */}
        {aiPlan?.aiAdvice && (
          <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
            <View style={styles.aiHeader}>
              <View style={styles.aiTitleContainer}>
                <Ionicons name="bulb" size={24} color={Colors.primary} />
                <Text style={[styles.cardTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
                  {strings.language === 'hindi' ? 'AI वित्तीय सलाह' : 'AI Financial Advice'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.listenButton, isSpeaking && styles.stopButton]}
                onPress={handleListen}
              >
                <Ionicons name={isSpeaking ? 'stop' : 'volume-high'} size={20} color="#fff" />
                <Text style={styles.listenButtonText}>
                  {isSpeaking ? strings.stop : strings.listen}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.aiAdviceText, { color: isDark ? Colors.textDark : Colors.text }]}>
              {aiPlan.aiAdvice}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Expense Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDark ? styles.cardDark : styles.cardLight]}>
            <Text style={[styles.modalTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
              {strings.addExpense}
            </Text>

            <TextInput
              style={[styles.input, isDark && styles.inputDark, { color: isDark ? Colors.textDark : Colors.text }]}
              placeholder={strings.amount}
              placeholderTextColor={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
              keyboardType="numeric"
            />

            <TextInput
              style={[styles.input, isDark && styles.inputDark, { color: isDark ? Colors.textDark : Colors.text }]}
              placeholder={strings.description}
              placeholderTextColor={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
              value={newExpense.description}
              onChangeText={(text) => setNewExpense({ ...newExpense, description: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>{strings.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleAddExpense}
              >
                <Text style={styles.buttonText}>{strings.submit}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    padding: Spacing.lg,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  cardLight: {
    backgroundColor: Colors.cardBackground,
  },
  cardDark: {
    backgroundColor: Colors.cardBackgroundDark,
  },
  summaryLabel: {
    fontSize: Typography.body,
  },
  summaryValue: {
    fontSize: Typography.h2,
    fontWeight: 'bold',
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.h4,
    fontWeight: '600',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  expenseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: Typography.body,
    fontWeight: '600',
  },
  expenseDescription: {
    fontSize: Typography.caption,
    marginTop: Spacing.xs,
  },
  expenseAmount: {
    fontSize: Typography.h5,
    fontWeight: 'bold',
  },
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  aiTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: {
    fontSize: Typography.h5,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  stopButton: {
    backgroundColor: Colors.error,
  },
  listenButtonText: {
    color: '#fff',
    marginLeft: Spacing.xs,
    fontSize: Typography.caption,
    fontWeight: '600',
  },
  aiAdviceText: {
    fontSize: Typography.body,
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  modalTitle: {
    fontSize: Typography.h4,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    fontSize: Typography.body,
  },
  inputDark: {
    borderColor: Colors.borderDark,
    backgroundColor: Colors.backgroundDark,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  button: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
  },
  cancelButton: {
    backgroundColor: Colors.gray400,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
