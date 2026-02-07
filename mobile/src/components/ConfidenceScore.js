import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/theme';

export default function ConfidenceScore({ score }) {
  const { isDark } = useTheme();
  const { strings } = useLanguage();

  const getConfidenceLevel = (score) => {
    if (score < 30) return { level: strings.lowConfidence, color: Colors.lowConfidence };
    if (score < 60) return { level: strings.mediumConfidence, color: Colors.mediumConfidence };
    if (score < 85) return { level: strings.highConfidence, color: Colors.highConfidence };
    return { level: strings.expertConfidence, color: Colors.expertConfidence };
  };

  const { level, color } = getConfidenceLevel(score);

  return (
    <View style={[styles.container, isDark ? styles.cardDark : styles.cardLight]}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={24} color={color} />
        <Text style={[styles.title, { color: isDark ? Colors.textDark : Colors.text }]}>
          {strings.confidenceScore}
        </Text>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color }]}>
          {score}
        </Text>
        <Text style={[styles.maxScore, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
          /100
        </Text>
      </View>

      <Text style={[styles.level, { color: isDark ? Colors.textDark : Colors.text }]}>
        {level}
      </Text>
      
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { backgroundColor: isDark ? Colors.gray700 : Colors.gray200 }]}>
          <View style={[styles.progressFill, { width: `${score}%`, backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.h5,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  maxScore: {
    fontSize: Typography.h4,
    marginLeft: Spacing.xs,
  },
  level: {
    fontSize: Typography.body,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  progressBarContainer: {
    marginTop: Spacing.md,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
