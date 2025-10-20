import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import MobileHeader from './navigation/MobileHeader';
import MobileNavigation from './navigation/MobileNavigation';
import PWAInstallPrompt from './common/PWAInstallPrompt';
import { UIProvider } from '../contexts/UIContext';
import ConfirmationModal from './common/ConfirmationModal';
import NotificationPanel from './common/NotificationPanel';

// FIX: Changed to React.FC to address potential type inference issues.
const MainAppContent: React.FC = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const getTitle = (pathname: string) => {
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length === 0) return 'Home';
        
        const lastSegment = segments[segments.length - 1];
        if (lastSegment === 'dashboard') return 'Home';
        
        // Custom titles for product pages
        if(segments[0] === 'products') {
            if(segments.length === 1) return 'Product Hub';
            if(segments.length > 1) {
                 return lastSegment
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, char => char.toUpperCase());
            }
        }

        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
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

// FIX: Changed MainApp to React.FC to resolve a TypeScript error where UIProvider was reported as missing children.
const MainApp: React.FC = () => {
    return (
        <UIProvider>
            <MainAppContent />
        </UIProvider>
    );
};

export default MainApp;