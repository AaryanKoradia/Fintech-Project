import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { strings, currentLanguage, changeLanguage } = useLanguage();

  const handleLogout = () => {
    logout();
  };

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'english' ? 'hindi' : 'english');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
      {/* Profile Header */}
      <View style={[styles.header, isDark ? styles.cardDark : styles.cardLight]}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color={Colors.primary} />
        </View>
        <Text style={[styles.name, { color: isDark ? Colors.textDark : Colors.text }]}>
          {user?.name}
        </Text>
        <Text style={[styles.email, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
          {user?.email}
        </Text>
        {user?.village && (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} />
            <Text style={[styles.village, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
              {user.village}
            </Text>
          </View>
        )}
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
          {strings.settings}
        </Text>

        {/* Dark Mode Toggle */}
        <View style={[styles.settingItem, isDark ? styles.cardDark : styles.cardLight]}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={24} color={isDark ? Colors.textDark : Colors.text} />
            <Text style={[styles.settingText, { color: isDark ? Colors.textDark : Colors.text }]}>
              {strings.darkMode}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: Colors.gray300, true: Colors.primary }}
            thumbColor={isDark ? Colors.primaryLight : '#f4f3f4'}
          />
        </View>

        {/* Language Toggle */}
        <View style={[styles.settingItem, isDark ? styles.cardDark : styles.cardLight]}>
          <View style={styles.settingLeft}>
            <Ionicons name="language" size={24} color={isDark ? Colors.textDark : Colors.text} />
            <Text style={[styles.settingText, { color: isDark ? Colors.textDark : Colors.text }]}>
              {strings.language}
            </Text>
          </View>
          <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
            <Text style={[styles.languageButtonText, { color: Colors.primary }]}>
              {currentLanguage === 'english' ? 'हिंदी' : 'English'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.actionButton, isDark ? styles.cardDark : styles.cardLight]}
          onPress={() => {}}
        >
          <Ionicons name="pencil" size={24} color={Colors.primary} />
          <Text style={[styles.actionText, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.editProfile}
          </Text>
          <Ionicons name="chevron-forward" size={24} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, isDark ? styles.cardDark : styles.cardLight]}
          onPress={() => {}}
        >
          <Ionicons name="help-circle" size={24} color={Colors.primary} />
          <Text style={[styles.actionText, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.helpSupport}
          </Text>
          <Ionicons name="chevron-forward" size={24} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, isDark ? styles.cardDark : styles.cardLight]}
          onPress={() => {}}
        >
          <Ionicons name="information-circle" size={24} color={Colors.primary} />
          <Text style={[styles.actionText, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.aboutApp}
          </Text>
          <Ionicons name="chevron-forward" size={24} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="#fff" />
        <Text style={styles.logoutText}>{strings.logout}</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={[styles.version, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
        {strings.version} 1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: Spacing.xl,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  cardLight: {
    backgroundColor: Colors.cardBackground,
  },
  cardDark: {
    backgroundColor: Colors.cardBackgroundDark,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: Typography.h3,
    fontWeight: 'bold',
  },
  email: {
    fontSize: Typography.body,
    marginTop: Spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  village: {
    fontSize: Typography.caption,
    marginLeft: Spacing.xs,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h5,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: Typography.body,
    marginLeft: Spacing.md,
  },
  languageButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight + '20',
  },
  languageButtonText: {
    fontSize: Typography.body,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  actionText: {
    flex: 1,
    fontSize: Typography.body,
    marginLeft: Spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  logoutText: {
    color: '#fff',
    fontSize: Typography.h6,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  version: {
    textAlign: 'center',
    fontSize: Typography.caption,
    marginBottom: Spacing.xl,
  },
});
