import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import DocumentsPage from './components/documents/DocumentsPage';
import SearchPage from './components/search/SearchPage';
import ClassificationPage from './components/classification/ClassificationPage';
import ProfilePage from './components/profile/ProfilePage';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import HelpPage from './components/pages/HelpPage';
import TermsOfServicePage from './components/pages/TermsOfServicePage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
import NotFoundPage from './components/pages/NotFoundPage';
import MaintenancePage from './components/pages/MaintenancePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/error/ErrorBoundary';
import { DocumentProvider } from './contexts/DocumentContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DocumentProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="classification" element={<ClassificationPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="terms" element={<TermsOfServicePage />} />
                <Route path="privacy" element={<PrivacyPolicyPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </DocumentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;