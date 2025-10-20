import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { queryClient } from './lib/queryClient';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainApp from './components/MainApp';
import ProductsPage from './components/products/ProductsPage';
import SettingsPage from './components/settings/SettingsPage';
import AccountPage from './components/account/AccountPage';
import Dashboard from './components/dashboard/Dashboard';
import LeadsPage from './components/leads/LeadsPage';
import ClientsPage from './components/clients/ClientsPage';
import DealsPage from './components/deals/DealsPage';
import TasksPage from './components/tasks/TasksPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            {/* FIX: Refactored to use a layout route with an Outlet in MainApp. This is a cleaner routing pattern and resolves the children prop error. */}
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
              <Route path="products" element={<ProductsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;