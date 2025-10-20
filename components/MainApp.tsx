import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import MobileHeader from './navigation/MobileHeader';
import MobileNavigation from './navigation/MobileNavigation';
import PWAInstallPrompt from './common/PWAInstallPrompt';
import { UIProvider } from '../contexts/UIContext';
import ConfirmationModal from './common/ConfirmationModal';
import NotificationPanel from './common/NotificationPanel';

const MainAppContent: React.FC = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const getTitle = (pathname: string) => {
        const path = pathname.split('/')[1] || 'dashboard';
        if (path === 'dashboard') return 'Home';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    const [title, setTitle] = useState(getTitle(location.pathname));

    useEffect(() => {
        setTitle(getTitle(location.pathname));
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-gray-50">
            <MobileHeader title={title} onMenuClick={() => setIsSidebarOpen(true)} />
            
            <main className="pb-24 pt-20 px-4">
                <Outlet />
            </main>

            <MobileNavigation isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <PWAInstallPrompt />
            <ConfirmationModal />
            <NotificationPanel />
        </div>
    );
};

// This component now wraps the main layout with the UIProvider.
// FIX: Correctly typed MainApp as a React.FC, as it does not accept children. This resolves the TypeScript error about a missing 'children' property.
const MainApp: React.FC = () => {
    return (
        <UIProvider>
            <MainAppContent />
        </UIProvider>
    );
};

export default MainApp;
