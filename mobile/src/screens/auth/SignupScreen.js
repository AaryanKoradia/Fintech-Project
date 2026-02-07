import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Colors, Spacing, BorderRadius, Typography } from '../../styles/theme';

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    village: '',
    income: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const { isDark } = useTheme();
  const { strings } = useLanguage();

  const handleSignup = async () => {
    const { name, email, village, income, password, confirmPassword } = formData;

    if (!name || !email || !village || !income || !password || !confirmPassword) {
      alert(strings.validationError);
      return;
    }

    if (password !== confirmPassword) {
      alert(strings.passwordMismatch);
      return;
    }

    setLoading(true);
    const result = await signup({
      name,
      email,
      village,
      monthly_income: parseFloat(income),
      password,
    });
    setLoading(false);

    if (!result.success) {
      // Error is already shown in AuthContext
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="wallet" size={48} color={Colors.primary} />
          <Text style={[styles.title, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.startJourney}
          </Text>
        </View>

        {/* Signup Form */}
        <View style={[styles.formContainer, isDark ? styles.cardDark : styles.card]}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isDark && styles.inputDark, { color: isDark ? Colors.textDark : Colors.text }]}
              placeholder={strings.fullName}
              placeholderTextColor={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isDark && styles.inputDark, { color: isDark ? Colors.textDark : Colors.text }]}
              placeholder={strings.email}
              placeholderTextColor={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Village Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isDark && styles.inputDark, { color: isDark ? Colors.textDark : Colors.text }]}
              placeholder={strings.village}
              placeholderTextColor={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
              value={formData.village}
              onChangeText={(value) => updateField('village', value)}
            />
          </View>

          {/* Income Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isDark && styles.inputDark, { color: isDark ? Colors.textDark : Colors.text }]}
              placeholder={strings.income}
              placeholderTextColor={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
              value={formData.income}
              onChangeText={(value) => updateField('income', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isDark && styles.inputDark, { color: isDark ? Colors.textDark : Colors.text }]}
              placeholder={strings.password}
              placeholderTextColor={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isDark && styles.inputDark, { color: isDark ? Colors.textDark : Colors.text }]}
              placeholder={strings.confirmPassword}
              placeholderTextColor={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
              value={formData.confirmPassword}
              onChangeText={(value) => updateField('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.signupButton, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signupButtonText}>{strings.signup}</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
              {strings.alreadyHaveAccount}{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>{strings.login}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: 'bold',
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  formContainer: {
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
  },
  cardDark: {
    backgroundColor: Colors.cardBackgroundDark,
    borderRadius: BorderRadius.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: Typography.body,
  },
  inputDark: {
    borderColor: Colors.borderDark,
  },
  eyeIcon: {
    padding: Spacing.xs,
  },
  signupButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: Typography.h6,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  loginText: {
    fontSize: Typography.body,
  },
  loginLink: {
    fontSize: Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
});
