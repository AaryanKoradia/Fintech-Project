import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../styles/theme';

// User Screens
import DashboardScreen from '../screens/user/DashboardScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import ExpenseTrackerScreen from '../screens/user/ExpenseTrackerScreen';
import AIAdvisorScreen from '../screens/user/AIAdvisorScreen';
import LearningScreen from '../screens/user/LearningScreen';
import SchemesScreen from '../screens/user/SchemesScreen';
import DocumentScannerScreen from '../screens/user/DocumentScannerScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManageUsersScreen from '../screens/admin/ManageUsersScreen';
import ManageSchemesScreen from '../screens/admin/ManageSchemesScreen';
import AnalyticsScreen from '../screens/admin/AnalyticsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// User Tab Navigator
function UserTabs() {
  const { isDark } = useTheme();
  const { strings } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Learn') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Schemes') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: isDark ? Colors.gray400 : Colors.gray500,
        tabBarStyle: {
          backgroundColor: isDark ? Colors.cardBackgroundDark : Colors.cardBackground,
          borderTopColor: isDark ? Colors.borderDark : Colors.border,
        },
        headerStyle: {
          backgroundColor: isDark ? Colors.cardBackgroundDark : Colors.cardBackground,
        },
        headerTintColor: isDark ? Colors.textDark : Colors.text,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: strings.dashboard }}
      />
      <Tab.Screen 
        name="Learn" 
        component={LearningScreen}
        options={{ title: strings.learn }}
      />
      <Tab.Screen 
        name="Schemes" 
        component={SchemesScreen}
        options={{ title: strings.schemes }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: strings.profile }}
      />
    </Tab.Navigator>
  );
}

// Admin Tab Navigator
function AdminTabs() {
  const { isDark } = useTheme();
  const { strings } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'AdminDashboard') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'ManageUsers') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ManageSchemes') {
            iconName = focused ? 'documents' : 'documents-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: isDark ? Colors.gray400 : Colors.gray500,
        tabBarStyle: {
          backgroundColor: isDark ? Colors.cardBackgroundDark : Colors.cardBackground,
          borderTopColor: isDark ? Colors.borderDark : Colors.border,
        },
        headerStyle: {
          backgroundColor: isDark ? Colors.cardBackgroundDark : Colors.cardBackground,
        },
        headerTintColor: isDark ? Colors.textDark : Colors.text,
      })}
    >
      <Tab.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{ title: strings.adminDashboard }}
      />
      <Tab.Screen 
        name="ManageUsers" 
        component={ManageUsersScreen}
        options={{ title: strings.manageUsers }}
      />
      <Tab.Screen 
        name="ManageSchemes" 
        component={ManageSchemesScreen}
        options={{ title: strings.manageSchemes }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{ title: strings.analytics }}
      />
    </Tab.Navigator>
  );
}

// Main Stack for authenticated users
export default function MainStack() {
  const { isDark } = useTheme();
  const { isAdmin } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? Colors.cardBackgroundDark : Colors.cardBackground,
        },
        headerTintColor: isDark ? Colors.textDark : Colors.text,
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={isAdmin ? AdminTabs : UserTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ExpenseTracker" component={ExpenseTrackerScreen} />
      <Stack.Screen name="AIAdvisor" component={AIAdvisorScreen} />
      <Stack.Screen name="DocumentScanner" component={DocumentScannerScreen} />
    </Stack.Navigator>
  );
}
