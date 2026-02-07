import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { confidenceAPI, nudgesAPI } from '../../services/api';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/theme';

export default function DashboardScreen({ navigation }) {
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [nudges, setNudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();
  const { isDark } = useTheme();
  const { strings } = useLanguage();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [scoreRes, nudgesRes] = await Promise.all([
        confidenceAPI.getScore(),
        nudgesAPI.getDailyNudges(),
      ]);
      setConfidenceScore(scoreRes.data);
      setNudges(nudgesRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
          {strings.welcomeBack}
        </Text>
        <Text style={[styles.nameText, { color: isDark ? Colors.textDark : Colors.text }]}>
          {user?.name}!
        </Text>
      </View>

      {/* Confidence Score Card */}
      {confidenceScore && (
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <View style={styles.scoreHeader}>
            <Ionicons name="trophy" size={32} color={Colors.primary} />
            <Text style={[styles.cardTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
              {strings.confidenceScore}
            </Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreNumber, { color: Colors.primary }]}>
              {confidenceScore.score}/100
            </Text>
            <Text style={[styles.scoreLabel, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
              {strings.yourConfidence}
            </Text>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
        {strings.quickActions}
      </Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionCard, isDark ? styles.cardDark : styles.cardLight]}
          onPress={() => navigation.navigate('ExpenseTracker')}
        >
          <Ionicons name="wallet" size={32} color={Colors.primary} />
          <Text style={[styles.actionText, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.expenseTracker}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, isDark ? styles.cardDark : styles.cardLight]}
          onPress={() => navigation.navigate('AIAdvisor')}
        >
          <Ionicons name="bulb" size={32} color={Colors.primary} />
          <Text style={[styles.actionText, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.aiAdvisor}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, isDark ? styles.cardDark : styles.cardLight]}
          onPress={() => navigation.navigate('DocumentScanner')}
        >
          <Ionicons name="scan" size={32} color={Colors.primary} />
          <Text style={[styles.actionText, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.documentScanner}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, isDark ? styles.cardDark : styles.cardLight]}
          onPress={() => navigation.navigate('Learn')}
        >
          <Ionicons name="book" size={32} color={Colors.primary} />
          <Text style={[styles.actionText, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.learn}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Daily Nudges */}
      {nudges.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.dailyNudges}
          </Text>
          {nudges.map((nudge, index) => (
            <View key={index} style={[styles.nudgeCard, isDark ? styles.cardDark : styles.cardLight]}>
              <Ionicons name="notifications" size={24} color={Colors.primary} />
              <Text style={[styles.nudgeText, { color: isDark ? Colors.textDark : Colors.text }]}>
                {nudge.message}
              </Text>
            </View>
          ))}
        </>
      )}

      {/* Voice Support */}
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight, styles.voiceCard]}>
        <Ionicons name="call" size={32} color={Colors.primary} />
        <Text style={[styles.cardTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
          {strings.voiceSupport}
        </Text>
        <Text style={[styles.voiceSubtext, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
          {strings.language === 'hindi' ? '24/7 वॉइस सहायता उपलब्ध' : '24/7 Voice Support Available'}
        </Text>
      </View>
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
  header: {
    padding: Spacing.lg,
  },
  welcomeText: {
    fontSize: Typography.body,
  },
  nameText: {
    fontSize: Typography.h2,
    fontWeight: 'bold',
    marginTop: Spacing.xs,
  },
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
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
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.h4,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: Typography.body,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.h4,
    fontWeight: '600',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionCard: {
    width: '47%',
    margin: '1.5%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  actionText: {
    marginTop: Spacing.sm,
    fontSize: Typography.body,
    fontWeight: '600',
    textAlign: 'center',
  },
  nudgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  nudgeText: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: Typography.body,
  },
  voiceCard: {
    alignItems: 'center',
  },
  voiceSubtext: {
    fontSize: Typography.caption,
    marginTop: Spacing.xs,
  },
});
