/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm Civic Design - Rural Digital Governance
        primary: {
          DEFAULT: '#C2410C',  // Earthy Orange
          hover: '#9A3412',
          light: '#FFF7ED',
        },
        authority: {
          DEFAULT: '#1E3A8A',  // Deep Blue
          hover: '#1E40AF',
          light: '#EFF6FF',
        },
        success: {
          DEFAULT: '#166534',  // Muted Green
          light: '#F0FDF4',
        },
        warning: {
          DEFAULT: '#D97706',  // Amber
          light: '#FFFBEB',
        },
        error: {
          DEFAULT: '#B91C1C',  // Soft Red
          light: '#FEF2F2',
        },
        text: {
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#9CA3AF',
        },
        bg: {
          primary: '#FFFFFF',
          secondary: '#FFF7ED',  // Warm neutral
          neutral: '#F9FAFB',
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#D1D5DB',
        }
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
