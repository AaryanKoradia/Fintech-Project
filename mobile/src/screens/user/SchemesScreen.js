import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { schemesAPI } from '../../services/api';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/theme';

export default function SchemesScreen() {
  const [schemes, setSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const { isDark } = useTheme();
  const { strings }  = useLanguage();

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      const response = await schemesAPI.getAllSchemes();
      setSchemes(response.data);
    } catch (error) {
      console.error('Error loading schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemes = schemes.filter(scheme =>
    scheme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
        <Ionicons name="search" size={20} color={isDark ? Colors.textSecondaryDark : Colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: isDark ? Colors.textDark : Colors.text }]}
          placeholder={strings.search}
          placeholderTextColor={isDark ? Colors.textSecondaryDark : Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Schemes List */}
      <ScrollView style={styles.schemesList}>
        {filteredSchemes.map((scheme, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.schemeCard, isDark ? styles.cardDark : styles.cardLight]}
          >
            <View style={styles.schemeHeader}>
              <Ionicons name="document-text" size={32} color={Colors.primary} />
              <View style={styles.schemeInfo}>
                <Text style={[styles.schemeName, { color: isDark ? Colors.textDark : Colors.text }]}>
                  {scheme.name}
                </Text>
                <Text style={[styles.schemeCategory, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
                  {scheme.category}
                </Text>
              </View>
            </View>
            <Text style={[styles.schemeDescription, { color: isDark ? Colors.textDark : Colors.text }]}>
              {scheme.description}
            </Text>
            <View style={styles.schemeFooter}>
              <View style={styles.eligibilityBadge}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={[styles.eligibilityText, { color: Colors.success }]}>
                  {strings.eligibility}
                </Text>
              </View>
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>{strings.apply}</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  searchContainerDark: {
    backgroundColor: Colors.cardBackgroundDark,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.body,
  },
  schemesList: {
    flex: 1,
  },
  schemeCard: {
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
  schemeHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  schemeInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  schemeName: {
    fontSize: Typography.h6,
    fontWeight: '600',
  },
  schemeCategory: {
    fontSize: Typography.caption,
    marginTop: Spacing.xs,
  },
  schemeDescription: {
    fontSize: Typography.body,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  schemeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eligibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eligibilityText: {
    fontSize: Typography.caption,
    marginLeft: Spacing.xs,
    fontWeight: '600',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: Typography.caption,
    fontWeight: '600',
    marginRight: Spacing.xs,
  },
});
