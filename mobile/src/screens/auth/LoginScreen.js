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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { isDark } = useTheme();
  const { strings } = useLanguage();

  const handleLogin = async () => {
    if (!email || !password) {
      alert(strings.validationError);
      return;
    }

    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);

    if (!result.success) {
      // Error is already shown in AuthContext
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo/Header */}
        <View style={styles.header}>
          <Ionicons
            name="wallet"
            size={64}
            color={Colors.primary}
          />
          <Text style={[styles.title, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.appName}
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
            {strings.appTagline}
          </Text>
        </View>

        {/* Login Form */}
        <View style={[styles.formContainer, isDark ? styles.cardDark : styles.card]}>
          <Text style={[styles.welcomeText, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.welcomeBackLogin}
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, isDark && styles.inputDark, { color: isDark ? Colors.textDark : Colors.text }]}
              placeholder={strings.email}
              placeholderTextColor={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, isDark && styles.inputDark, { color: isDark ? Colors.textDark : Colors.text }]}
              placeholder={strings.password}
              placeholderTextColor={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>{strings.login}</Text>
            )}
          </TouchableOpacity>

          {/* Signup Link */}
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
              {strings.dontHaveAccount}{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>{strings.signup}</Text>
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
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.h1,
    fontWeight: 'bold',
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.body,
    marginTop: Spacing.xs,
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
  welcomeText: {
    fontSize: Typography.h4,
    fontWeight: '600',
    marginBottom: Spacing.lg,
    textAlign: 'center',
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
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: Typography.h6,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  signupText: {
    fontSize: Typography.body,
  },
  signupLink: {
    fontSize: Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
});
