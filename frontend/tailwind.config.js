/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Indian Government Inspired Color Palette
        // Based on Indian Flag & Professional Gov Portals
        saffron: {
          50: '#FFF5E6',
          100: '#FFE6C7',
          200: '#FFD699',
          300: '#FFC266',
          400: '#FFAD33',
          500: '#FF9933', // Main saffron
          600: '#E68A2E',
          700: '#CC7A29',
          800: '#B36924',
          900: '#99581F',
        },
        india: {
          green: '#138808', // Indian flag green
          saffron: '#FF9933', // Indian flag saffron
          blue: '#000080', // Navy blue for professional look
          ashoka: '#000080', // Ashoka Chakra blue
        },
        primary: {
          light: '#138808', // Indian green
          dark: '#1ea912',  // Lighter green for dark mode
        },
        secondary: {
          light: '#000080', // Navy blue
          dark: '#4169E1',  // Royal blue for dark mode
        },
        accent: {
          light: '#FF9933', // Saffron
          dark: '#FFB366',  // Lighter saffron
        },
        background: {
          light: '#F8F9FA',
          dark: '#1a1a2e',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#16213e',
        },
        text: {
          light: '#1a1a1a',
          dark: '#F5F5F5',
        }
      },
      fontSize: {
        'xl-mobile': '1.25rem',
        '2xl-mobile': '1.5rem',
      },
      boxShadow: {
        'gov': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'gov-lg': '0 4px 16px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
