/**
 * Main Application Component
 * Configures routing, contexts, and protected routes
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';

// Dashboards
import UserDashboard from './dashboards/UserDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

// User Pages
import Learning from './pages/Learning';
import Schemes from './pages/Schemes';
import AIAdvisor from './pages/AIAdvisor';
import Profile from './pages/Profile';

// Admin Pages
import ManageUsers from './pages/admin/ManageUsers';
import ManageSchemes from './pages/admin/ManageSchemes';
import Analytics from './pages/admin/Analytics';
import ManageAdmins from './pages/admin/ManageAdmins';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* User Routes - Protected */}
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/learn"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <Learning />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/schemes"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <Schemes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/ai-advisor"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <AIAdvisor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/profile"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Routes - Protected */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-admins"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ManageAdmins />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/schemes"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ManageSchemes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              
              {/* 404 - Redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
