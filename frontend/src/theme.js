/**
 * Centralized Theme Configuration
 * Rural Digital Governance Platform - Warm Civic Design
 */

export const theme = {
  colors: {
    // Primary Background
    white: '#FFFFFF',
    
    // Primary Warm Action Color
    primary: '#C2410C',
    primaryHover: '#9A3412',
    primaryLight: '#FFF7ED',
    
    // Secondary Authority Color (use sparingly)
    authority: '#1E3A8A',
    authorityHover: '#1E40AF',
    authorityLight: '#EFF6FF',
    
    // Status Colors
    success: '#166534',
    successLight: '#F0FDF4',
    warning: '#D97706',
    warningLight: '#FFFBEB',
    error: '#B91C1C',
    errorLight: '#FEF2F2',
    
    // Text
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    
    // Backgrounds
    bgPrimary: '#FFFFFF',
    bgSecondary: '#FFF7ED',
    bgNeutral: '#F9FAFB',
    
    // Borders
    border: '#E5E7EB',
    borderDark: '#D1D5DB',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
};

// Utility classes for common patterns
export const commonStyles = {
  // Buttons
  primaryButton: `bg-[${theme.colors.primary}] hover:bg-[${theme.colors.primaryHover}] text-white font-medium px-6 py-2.5 rounded-lg transition-colors`,
  secondaryButton: `bg-white hover:bg-gray-50 text-[${theme.colors.textPrimary}] font-medium px-6 py-2.5 rounded-lg border border-[${theme.colors.border}] transition-colors`,
  authorityButton: `bg-[${theme.colors.authority}] hover:bg-[${theme.colors.authorityHover}] text-white font-medium px-6 py-2.5 rounded-lg transition-colors`,
  
  // Cards
  card: `bg-white rounded-lg border border-[${theme.colors.border}]`,
  cardWarm: `bg-[${theme.colors.bgSecondary}] rounded-lg border border-[${theme.colors.border}]`,
  
  // Text
  heading: `text-[${theme.colors.textPrimary}] font-bold`,
  subheading: `text-[${theme.colors.textSecondary}] font-medium`,
  body: `text-[${theme.colors.textSecondary}]`,
  muted: `text-[${theme.colors.textMuted}]`,
};

export default theme;
