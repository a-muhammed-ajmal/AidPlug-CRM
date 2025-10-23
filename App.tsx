import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';
import { queryClient } from './lib/queryClient';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainApp from './components/MainApp';
import SettingsPage from './components/settings/SettingsPage';
import AccountPage from './components/account/AccountPage';
import EditProfilePage from './components/account/EditProfilePage';
import Dashboard from './components/dashboard/Dashboard';
import LeadsPage from './components/leads/LeadsPage';
import ClientsPage from './components/clients/ClientsPage';
import DealsPage from './components/deals/DealsPage';
import TasksPage from './components/tasks/TasksPage';
import ProductsPage from './components/products/ProductsPage';
import ProductTypesPage from './components/products/ProductTypesPage';
import ProductListPage from './components/products/ProductListPage';
import ProductDetailPage from './components/products/ProductDetailPage';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import ConfirmationModal from './components/common/ConfirmationModal';
import NotificationPanel from './components/common/NotificationPanel';
import EmailConfirmationPage from './components/auth/EmailConfirmationPage';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UIProvider>
            <HashRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/auth/confirm" element={<EmailConfirmationPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainApp />
                    </ProtectedRoute>
                  }
                >
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
                    <Route path=":bankSlug/:typeSlug/:productSlug" element={<ProductDetailPage />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Routes>
            </HashRouter>

            {/* Global UI Components */}
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
