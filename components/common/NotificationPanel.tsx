import React from 'react';
import { X, Inbox } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import EmptyState from './EmptyState';

const NotificationPanel: React.FC = () => {
    const { showNotifications, setShowNotifications, notifications, dismissNotification, clearAllNotifications } = useUI();
    const unreadCount = notifications.filter(n => n.unread).length;

    if (!showNotifications) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end animate-fade-in sm:items-center">
            <div className="bg-white w-full max-w-md h-[80vh] rounded-t-2xl sm:rounded-xl shadow-xl flex flex-col animate-slide-up">
                <header className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
                    <button onClick={() => setShowNotifications(false)} className="p-2 -mr-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5 text-gray-600" /></button>
                </header>
                <main className="flex-1 overflow-y-auto p-2">
                    {notifications.length > 0 ? (
                        notifications.map(n => (
                            <div key={n.id} className={`p-3 rounded-lg mb-2 flex items-start space-x-3 ${n.unread ? 'bg-blue-50' : 'bg-white'}`}>
                                {n.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>}
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{n.title}</p>
                                    <p className="text-sm text-gray-600">{n.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                                </div>
                                {n.unread && <button onClick={() => dismissNotification(n.id)} className="p-1 text-xs text-blue-600 hover:bg-blue-100 rounded">Mark as read</button>}
                            </div>
                        ))
                    ) : (
                        <EmptyState
                            icon={<Inbox className="w-12 h-12 text-gray-300" />}
                            title="No Notifications"
                            message="You're all caught up!"
                         />
                    )}
                </main>
                {unreadCount > 0 && (
                    <footer className="p-4 bg-gray-50 border-t">
                        <button onClick={clearAllNotifications} className="w-full text-sm text-blue-600 font-medium">Mark all as read</button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;