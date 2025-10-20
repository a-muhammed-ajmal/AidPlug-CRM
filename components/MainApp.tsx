import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import MobileHeader from './navigation/MobileHeader';
import MobileNavigation from './navigation/MobileNavigation';
import PWAInstallPrompt from './common/PWAInstallPrompt';
import { UIProvider } from '../contexts/UIContext';
import ConfirmationModal from './common/ConfirmationModal';
import NotificationPanel from './common/NotificationPanel';

// FIX: Changed component to use a React Router Outlet for rendering child routes instead of a `children` prop. This resolves a cryptic type error and simplifies the routing structure.
// FIX: Changed to React.FC to correctly type the component. This resolves an issue where TypeScript incorrectly inferred that the 'children' prop was required.
// FIX: Refactored from a const arrow function with React.FC to a standard function declaration to avoid potential typing issues.
export default function MainApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Close sidebar on navigation change
    setSidebarOpen(false);
  }, [location.pathname]);
  
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      leads: 'Leads',
      clients: 'Clients',
      products: 'Products',
      deals: 'Deals',
      tasks: 'Tasks',
      settings: 'Settings',
      account: 'My Account'
    };
    return titles[path] || 'Dashboard';
  };

  return (
    <UIProvider>
        <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
          <MobileHeader
            title={getPageTitle()}
            onMenuClick={() => setSidebarOpen(true)}
          />
          
          <main className="px-4 py-6 max-w-md mx-auto pt-20">
            <Outlet />
          </main>

          <MobileNavigation
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <PWAInstallPrompt />
          
          {/* Global Modals from Context */}
          <ConfirmationModal />
          <NotificationPanel />
        </div>
    </UIProvider>
  );
}