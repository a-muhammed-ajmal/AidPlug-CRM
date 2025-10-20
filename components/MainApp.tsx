import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import MobileHeader from './navigation/MobileHeader';
import MobileNavigation from './navigation/MobileNavigation';
import PWAInstallPrompt from './common/PWAInstallPrompt';
import { UIProvider } from '../contexts/UIContext';
import ConfirmationModal from './common/ConfirmationModal';
import NotificationPanel from './common/NotificationPanel';

const MainAppContent = () => {
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
// FIX: Removed explicit React.FC type. Relying on type inference for functional components avoids potential issues with how different versions of @types/react handle the 'children' prop, which was causing the error.
const MainApp = () => {
    return (
        <UIProvider>
            <MainAppContent />
        </UIProvider>
    );
};

export default MainApp;