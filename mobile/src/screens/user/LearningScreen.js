import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { learningAPI } from '../../services/api';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/theme';

export default function LearningScreen() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isDark } = useTheme();
  const { strings } = useLanguage();

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const response = await learningAPI.getLessons();
      setLessons(response.data);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLessonIcon = (category) => {
    const icons = {
      'Savings': 'cash',
      'Budgeting': 'calculator',
      'Banking': 'card',
      'Insurance': 'shield',
      'Business': 'briefcase',
      'Investments': 'trending-up',
    };
    return icons[category] || 'book';
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
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? Colors.textDark : Colors.text }]}>
          {strings.lessons}
        </Text>
      </View>

      {lessons.map((lesson, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.lessonCard, isDark ? styles.cardDark : styles.cardLight]}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={getLessonIcon(lesson.category)} size={32} color={Colors.primary} />
          </View>
          <View style={styles.lessonInfo}>
            <Text style={[styles.lessonTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
              {lesson.title}
            </Text>
            <Text style={[styles.lessonDescription, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
              {lesson.description}
            </Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${lesson.progress || 0}%` }]} />
              </View>
              <Text style={[styles.progressText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
                {lesson.progress || 0}%
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} />
        </TouchableOpacity>
      ))}
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
  title: {
    fontSize: Typography.h3,
    fontWeight: 'bold',
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  cardLight: {
    backgroundColor: Colors.cardBackground,
  },
  cardDark: {
    backgroundColor: Colors.cardBackgroundDark,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: Typography.h6,
    fontWeight: '600',
  },
  lessonDescription: {
    fontSize: Typography.caption,
    marginTop: Spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: 3,
    marginRight: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: Typography.caption,
    width: 40,
  },
});
