import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { adminAPI } from '../../services/api';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/theme';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isDark } = useTheme();
  const { strings } = useLanguage();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, isDark ? styles.cardDark : styles.cardLight, { backgroundColor: Colors.primary + '20' }]}>
          <Ionicons name="people" size={32} color={Colors.primary} />
          <Text style={[styles.statValue, { color: Colors.primary }]}>
            {stats?.totalUsers || 0}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.totalUsers}
          </Text>
        </View>

        <View style={[styles.statCard, isDark ? styles.cardDark : styles.cardLight, { backgroundColor: Colors.success + '20' }]}>
          <Ionicons name="trending-up" size={32} color={Colors.success} />
          <Text style={[styles.statValue, { color: Colors.success }]}>
            {stats?.activeUsers || 0}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.activeUsers}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
        {strings.language === 'hindi' ? 'त्वरित कार्रवाई' : 'Quick Actions'}
      </Text>
      
      <TouchableOpacity
        style={[styles.actionCard, isDark ? styles.cardDark : styles.cardLight]}
        onPress={() => navigation.navigate('ManageUsers')}
      >
        <Ionicons name="people" size={24} color={Colors.primary} />
        <Text style={[styles.actionText, { color: isDark ? Colors.textDark : Colors.text }]}>
          {strings.manageUsers}
        </Text>
        <Ionicons name="chevron-forward" size={24} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionCard, isDark ? styles.cardDark : styles.cardLight]}
        onPress={() => navigation.navigate('ManageSchemes')}
      >
        <Ionicons name="documents" size={24} color={Colors.primary} />
        <Text style={[styles.actionText, { color: isDark ? Colors.textDark : Colors.text }]}>
          {strings.manageSchemes}
        </Text>
        <Ionicons name="chevron-forward" size={24} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionCard, isDark ? styles.cardDark : styles.cardLight]}
        onPress={() => navigation.navigate('Analytics')}
      >
        <Ionicons name="analytics" size={24} color={Colors.primary} />
        <Text style={[styles.actionText, { color: isDark ? Colors.textDark : Colors.text }]}>
          {strings.analytics}
        </Text>
        <Ionicons name="chevron-forward" size={24} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} />
      </TouchableOpacity>
    </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  statCard: {
    width: (width - Spacing.lg * 3) / 2,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  cardLight: {
    backgroundColor: Colors.cardBackground,
  },
  cardDark: {
    backgroundColor: Colors.cardBackgroundDark,
  },
  statValue: {
    fontSize: Typography.h2,
    fontWeight: 'bold',
    marginTop: Spacing.sm,
  },
  statLabel: {
    fontSize: Typography.caption,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: Typography.h4,
    fontWeight: '600',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  actionText: {
    flex: 1,
    fontSize: Typography.body,
    fontWeight: '600',
    marginLeft: Spacing.md,
  },
});
