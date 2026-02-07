/**
 * Theme Configuration for Mobile App
 * Colors, spacing, and typography
 */

export const Colors = {
  // Primary Colors
  primary: '#2596be',
  primaryDark: '#1a7a9e',
  primaryLight: '#4db3d4',
  
  // Background
  background: '#f5f5f5',
  backgroundDark: '#1a1a1a',
  cardBackground: '#ffffff',
  cardBackgroundDark: '#2d2d2d',
  
  // Text
  text: '#333333',
  textDark: '#ffffff',
  textSecondary: '#666666',
  textSecondaryDark: '#aaaaaa',
  
  // Status
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Gray Scale
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Borders
  border: '#e0e0e0',
  borderDark: '#404040',
  
  // Confidence Score Colors
  lowConfidence: '#ef4444',
  mediumConfidence: '#f59e0b',
  highConfidence: '#10b981',
  expertConfidence: '#8b5cf6',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const Typography = {
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  body: 14,
  caption: 12,
  small: 10,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const GlobalStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  containerDark: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },
  cardDark: {
    backgroundColor: Colors.cardBackgroundDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: Typography.body,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.body,
    backgroundColor: Colors.cardBackground,
  },
  inputDark: {
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.body,
    backgroundColor: Colors.cardBackgroundDark,
    color: Colors.textDark,
  },
};
