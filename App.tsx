import React, { Suspense, lazy } from 'react';
// Use BrowserRouter for cleaner URLs. Requires server-side configuration.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';
import { queryClient } from './lib/queryClient';

import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import MainLayout from './components/MainLayout'; // Renamed MainApp for clarity as a layout component

// --- Global UI Components (eagerly loaded as they are always needed) ---
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import ConfirmationModal from './components/common/ConfirmationModal';
import NotificationPanel from './components/common/NotificationPanel';
import FullPageSpinner from './components/common/FullPageSpinner'; // A simple spinner for Suspense fallback

// --- Lazy-loaded Page Components ---
// Auth pages can be loaded together as they are small and often navigated between.
const LoginPage = lazy(() => import('./components/auth/LoginPage'));
const SignupPage = lazy(() => import('./components/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./components/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./components/auth/ResetPasswordPage'));
const EmailConfirmationPage = lazy(() => import('./components/auth/EmailConfirmationPage'));

// Main application pages are lazy-loaded for performance.
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const LeadsPage = lazy(() => import('./components/leads/LeadsPage'));
const ClientsPage = lazy(() => import('./components/clients/ClientsPage'));
const DealsPage = lazy(() => import('./components/deals/DealsPage'));
const TasksPage = lazy(() => import('./components/tasks/TasksPage'));
const SettingsPage = lazy(() => import('./components/settings/SettingsPage'));

// Nested Product pages
const ProductsPage = lazy(() => import('./components/products/ProductsPage'));
const ProductTypesPage = lazy(() => import('./components/products/ProductTypesPage'));
const ProductListPage = lazy(() => import('./components/products/ProductListPage'));
const ProductDetailPage = lazy(() => import('./components/products/ProductDetailPage'));


function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UIProvider>
            {/* Switched to BrowserRouter. Your server must be configured to redirect all
                unmatched routes to index.html for this to work on refresh/deep-link. */}
            <BrowserRouter>
              {/* Suspense provides a fallback UI while lazy-loaded components are fetched */}
              <Suspense fallback={<FullPageSpinner />}>
                <Routes>
                  {/* Public Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/auth/confirm" element={<EmailConfirmationPage />} />

                  {/* Protected Application Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<MainLayout />}>
                      {/* Redirect from root to dashboard */}
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="leads" element={<LeadsPage />} />
                      <Route path="clients" element={<ClientsPage />} />
                      <Route path="deals" element={<DealsPage />} />
                      <Route path="tasks" element={<TasksPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                      
                      {/* Well-structured nested routes for products */}
                      <Route path="products">
                        <Route index element={<ProductsPage />} />
                        <Route path=":bankSlug" element={<ProductTypesPage />} />
                        <Route path=":bankSlug/:typeSlug" element={<ProductListPage />} />
                        <Route path=":bankSlug/:typeSlug/:productSlug" element={<ProductDetailPage />} />
                      </Route>

                      {/* A catch-all for any other route inside the app, redirects to dashboard */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>

            {/* Global UI Components remain outside the router to persist across navigation */}
            <PWAInstallPrompt />
            <ConfirmationModal />
            <NotificationPanel />
          </UIProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
