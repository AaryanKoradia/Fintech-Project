import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import UserDashboard from './dashboards/UserDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import Learning from './pages/Learning';
import Schemes from './pages/Schemes';
import AIAdvisor from './pages/AIAdvisor';
import Profile from './pages/Profile';
import ExpenseTracker from './pages/ExpenseTracker';
import DocumentScanner from './pages/DocumentScanner';
import MoneyTranslator from './pages/MoneyTranslator';
import ManageUsers from './pages/admin/ManageUsers';
import ManageSchemes from './pages/admin/ManageSchemes';
import Analytics from './pages/admin/Analytics';
import ManageAdmins from './pages/admin/ManageAdmins';
import ManageNotifications from './pages/admin/ManageNotifications';
import BankingEducation from './pages/BankingEducation';
import GovernmentDashboard from './pages/GovernmentDashboard';
import AgentPortal from './pages/AgentPortal';
import Marketplace from './pages/Marketplace';
import VoiceReader from './components/VoiceReader';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <VoiceReader />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={['USER']}><UserDashboard /></ProtectedRoute>} />
              <Route path="/user/learn" element={<ProtectedRoute allowedRoles={['USER']}><Learning /></ProtectedRoute>} />
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
              <Route
                path="/user/expenses"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <ExpenseTracker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/money-translator"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <MoneyTranslator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/document-scanner"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <DocumentScanner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/banking-education"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <BankingEducation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/marketplace"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <Marketplace />
                  </ProtectedRoute>
                }
              />
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
              <Route
                path="/admin/notifications"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ManageNotifications />
                  </ProtectedRoute>
                }
              />
              
             
              <Route
                path="/government/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_OFFICER', 'STATE_OFFICER', 'MINISTRY']}>
                    <GovernmentDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Agent Portal - for AGENT role */}
              <Route
                path="/agent/portal"
                element={
                  <ProtectedRoute allowedRoles={['AGENT']}>
                    <AgentPortal />
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
