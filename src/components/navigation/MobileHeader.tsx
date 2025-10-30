import { Bell, Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI, Notification } from '../../contexts/UIContext';

interface MobileHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function MobileHeader({
  title,
  onMenuClick,
}: MobileHeaderProps) {
  const { notifications, setShowNotifications } = useUI();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(
    (n: Notification) => n.unread
  ).length;

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40 shadow-sm lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <img src="/favicon.svg" alt="AidPlug CRM" className="w-6 h-6" />
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          </div>
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
          <button
            onClick={() => navigate('/account')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
