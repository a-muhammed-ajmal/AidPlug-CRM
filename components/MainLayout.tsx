import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MobileHeader from './navigation/MobileHeader';
import DesktopHeader from './navigation/DesktopHeader';
import MobileNavigation from './navigation/MobileNavigation';
import DesktopSidebar from './navigation/DesktopSidebar';
import { useUI } from '../contexts/UIContext';

const MainLayout = () => {
  // State for the mobile sidebar remains local to the layout, which is perfect.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get the page title directly from the UIContext.
  // The individual pages are now responsible for setting their own title.
  const { title } = useUI();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* The DesktopSidebar is always present on large screens */}
      <DesktopSidebar />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* The headers now get the title from the context */}
        <MobileHeader
          title={title}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <DesktopHeader title={title} />

        {/* The main content area where the page components will be rendered */}
        <main className="flex-grow pb-24 pt-20 lg:pt-[85px] lg:pb-6 px-3 lg:px-4">
          <Outlet />
        </main>
      </div>

      {/* The mobile navigation slides out and is controlled by local state */}
      <MobileNavigation
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
