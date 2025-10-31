import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthProvider';
import { UIProvider } from './contexts/UIProvider';
import { queryClient } from './lib/queryClient';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthLayout from './components/auth/AuthLayout';
import MainLayout from './components/MainLayout';
import AuthCallbackHandler from './components/auth/AuthCallbackHandler';

import ErrorBoundary from './components/common/ErrorBoundary';
import FullPageSpinner from './components/common/FullPageSpinner';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import ConfirmationModal from './components/common/ConfirmationModal';
import NotificationPanel from './components/common/NotificationPanel';

const LoginPage = lazy(() => import('./components/auth/LoginPage'));
const SignupPage = lazy(() => import('./components/auth/SignupPage'));
const ForgotPasswordPage = lazy(
  () => import('./components/auth/ForgotPasswordPage')
);
const ResetPasswordPage = lazy(
  () => import('./components/auth/ResetPasswordPage')
);
const EmailConfirmationPage = lazy(
  () => import('./components/auth/EmailConfirmationPage')
);
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const LeadsPage = lazy(() => import('./components/leads/LeadsPage'));
const ClientsPage = lazy(() => import('./components/clients/ClientsPage'));
const DealsPage = lazy(() => import('./components/deals/DealsPage'));
const TasksPage = lazy(() => import('./components/tasks/TasksPage'));
const SettingsPage = lazy(() => import('./components/settings/SettingsPage'));
const ProductsPage = lazy(() => import('./components/products/ProductsPage'));
const ProductTypesPage = lazy(
  () => import('./components/products/ProductTypesPage')
);
const ProductListPage = lazy(
  () => import('./components/products/ProductListPage')
);
const ProductDetailPage = lazy(
  () => import('./components/products/ProductDetailPage')
);
const AccountPage = lazy(() => import('./components/account/AccountPage'));
const EditProfilePage = lazy(
  () => import('./components/account/EditProfilePage')
);

function PublicRoutes() {
  return (
    <>
      <Route path="/" element={<AuthCallbackHandler />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/confirm" element={<EmailConfirmationPage />} />
      </Route>
    </>
  );
}

function ProtectedRoutes() {
  return (
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="deals" element={<DealsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="account/edit" element={<EditProfilePage />} />
        <Route path="products">
          <Route index element={<ProductsPage />} />
          <Route path=":bankSlug" element={<ProductTypesPage />} />
          <Route path=":bankSlug/:typeSlug" element={<ProductListPage />} />
          <Route
            path=":bankSlug/:typeSlug/:productSlug"
            element={<ProductDetailPage />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Route>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UIProvider>
            <BrowserRouter>
              <Suspense fallback={<FullPageSpinner />}>
                <Routes>
                  {PublicRoutes()}
                  {ProtectedRoutes()}
                </Routes>
              </Suspense>
            </BrowserRouter>
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
