# Sakhi Mobile App

React Native mobile application for Sakhi - Financial Literacy Platform for Rural India.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your mobile device (Download from Play Store/App Store)

## Setup Instructions

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file:
   - **For local development**: Find your computer's IP address
     - Windows: Run `ipconfig` in terminal
     - Mac/Linux: Run `ifconfig` in terminal
     - Update `EXPO_PUBLIC_API_URL=http://YOUR_IP:8000/api`
   
   - **For production**: Update with your production API URL
     ```
     EXPO_PUBLIC_API_URL=https://your-production-api.com/api
     ```

### 3. Start the Backend Server

Make sure your backend server is running:

```bash
cd backend
# Activate virtual environment
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Important**: Use `--host 0.0.0.0` to make the server accessible from your mobile device.

### 4. Start the Expo App

```bash
cd mobile
npm start
```

### 5. Run on Your Device

1. Install "Expo Go" app on your phone
2. Scan the QR code shown in the terminal
3. The app will load on your device

## Running on Emulator/Simulator

### Android Emulator
```bash
npm run android
```

### iOS Simulator (Mac only)
```bash
npm run ios
```

## Project Structure

```
mobile/
├── App.js                      # Root component
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── babel.config.js             # Babel configuration
├── .env                        # Environment variables
├── assets/                     # Images, icons, fonts
├── src/
│   ├── navigation/             # Navigation configuration
│   │   ├── AppNavigator.js
│   │   ├── AuthStack.js
│   │   └── MainStack.js
│   ├── screens/                # All app screens
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── SignupScreen.js
│   │   ├── user/
│   │   │   ├── DashboardScreen.js
│   │   │   ├── ProfileScreen.js
│   │   │   ├── ExpenseTrackerScreen.js
│   │   │   ├── AIAdvisorScreen.js
│   │   │   ├── LearningScreen.js
│   │   │   ├── SchemesScreen.js
│   │   │   └── DocumentScannerScreen.js
│   │   └── admin/
│   │       ├── AdminDashboardScreen.js
│   │       ├── ManageUsersScreen.js
│   │       ├── ManageSchemesScreen.js
│   │       └── AnalyticsScreen.js
│   ├── components/             # Reusable components
│   │   ├── ConfidenceScore.js
│   │   ├── DailyNudges.js
│   │   ├── Loading.js
│   │   └── SchemeCard.js
│   ├── context/                # Context providers
│   │   ├── AuthContext.js
│   │   ├── LanguageContext.js
│   │   └── ThemeContext.js
│   ├── services/               # API services
│   │   └── api.js
│   ├── lang/                   # Translations
│   │   ├── string_english.js
│   │   └── string_hindi.js
│   ├── utils/                  # Utility functions
│   │   └── storage.js
│   └── styles/                 # Global styles
│       └── theme.js
```

## Features

✅ User Authentication (Login/Signup)
✅ User Dashboard with Financial Confidence Score
✅ Admin Dashboard with Analytics
✅ Expense Tracker with AI Financial Planning
✅ AI Financial Advisor with Voice Support
✅ Document Scanner (Camera Integration)
✅ Learning Modules for Financial Literacy
✅ Government Schemes Browser
✅ Daily Financial Nudges
✅ Bilingual Support (English/Hindi)
✅ Dark Mode Support
✅ Voice-to-Text for AI Advice

## Troubleshooting

### Cannot Connect to Backend

1. Ensure backend is running with `--host 0.0.0.0`
2. Check your phone and computer are on the same WiFi network
3. Verify the IP address in `.env` is correct
4. Disable firewall temporarily to test connection

### App Crashes on Startup

1. Clear Expo cache: `expo start -c`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check for any missing permissions in `app.json`

### Camera Not Working

1. Ensure you've granted camera permissions
2. Check `app.json` has camera plugin configured
3. Restart the Expo app

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### Using EAS Build (Recommended)
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Backend API URL | `http://192.168.1.5:8000/api` |
| `EXPO_PUBLIC_APP_NAME` | App name | `Sakhi` |
| `EXPO_PUBLIC_PRIMARY_COLOR` | Primary theme color | `#2596be` |

## License

© 2026 Sakhi. Empowering Rural India.
