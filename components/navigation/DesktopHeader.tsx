import { Bell } from 'lucide-react';
// FIX: Corrected folder casing from 'Contexts' to 'contexts' and added Notification type
import { useUI, Notification } from '../../contexts/UIContext';

interface DesktopHeaderProps {
  title: string;
}

export default function DesktopHeader({ title }: DesktopHeaderProps) {
  const { notifications, setShowNotifications } = useUI();

  // FIX: Explicitly typing 'n' to solve the 'implicit any' error
  const unreadCount = notifications.filter(
    (n: Notification) => n.unread
  ).length;

  return (
    <header className="hidden lg:block bg-white border-b border-gray-200 fixed top-0 left-64 right-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3 h-[61px]">
        <div className="flex items-center space-x-3">
          <img src="/favicon.svg" alt="AidPlug CRM" className="w-8 h-8" />
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
