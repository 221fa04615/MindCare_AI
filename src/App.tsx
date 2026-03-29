import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import MoodTrackingPage from './pages/MoodTrackingPage';
import HelpDirectoryPage from './pages/HelpDirectoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PrivacyPage from './pages/PrivacyPage';
import AwarenessPage from './pages/AwarenessPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <div className="min-h-screen bg-background font-sans text-ink">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/awareness" element={<AwarenessPage />} />
        <Route path="/help" element={<HelpDirectoryPage />} />
        
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        } />
        
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/mood" element={
          <ProtectedRoute>
            <MoodTrackingPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
