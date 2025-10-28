import { X } from 'lucide-react';
import { useUI, Notification } from '../../contexts/UIContext'; // Corrected import path

export default function NotificationPanel() {
  const {
    notifications,
    showNotifications,
    setShowNotifications,
    dismissNotification,
  } = useUI();
  const unreadCount = notifications.filter(
    (n: Notification) => n.unread
  ).length;

  if (!showNotifications) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={() => setShowNotifications(false)}
    >
      <div
        className="fixed top-16 right-4 w-80 max-w-sm bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            Notifications ({unreadCount})
          </h2>
          <button
            onClick={() => setShowNotifications(false)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 p-8">
              No new notifications
            </p>
          ) : (
            notifications.map(
              (
                n: Notification // Corrected type
              ) => (
                <div
                  key={n.id}
                  className={`p-4 border-b hover:bg-gray-50 ${n.unread ? 'bg-blue-50' : ''}`}
                  onClick={() => dismissNotification(n.id)}
                >
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
