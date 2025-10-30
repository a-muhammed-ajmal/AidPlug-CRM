import {
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useAuth } from '../hooks/useAuth';
import { UIContext, Notification, Activity } from './UIContextDefinitions';

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const MAX_ACTIVITIES = 30;

// EXPORTED so other files can use it
export const UIProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('Dashboard');
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Get user-specific activity storage key
  const getActivityStorageKey = useCallback(() => {
    return user?.id ? `aidplug-crm-activities-${user.id}` : null;
  }, [user?.id]);

  useEffect(() => {
    const storageKey = getActivityStorageKey();
    if (!storageKey) return;

    try {
      const storedActivities = localStorage.getItem(storageKey);
      if (storedActivities) {
        setActivities(JSON.parse(storedActivities));
      } else {
        // Clear activities if no stored data for this user
        setActivities([]);
      }
    } catch (error) {
      console.error('Failed to load activities from localStorage', error);
      setActivities([]);
    }
  }, [getActivityStorageKey]);

  const hideConfirmation = useCallback(() => {
    setConfirmation((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showConfirmation = useCallback(
    (title: string, message: string, onConfirm: () => void) => {
      setConfirmation({
        isOpen: true,
        title,
        message,
        onConfirm: () => {
          onConfirm();
          hideConfirmation();
        },
        onCancel: hideConfirmation,
      });
    },
    [hideConfirmation]
  );

  const addNotification = useCallback((title: string, message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      title,
      message,
      time: 'Just now',
      unread: true,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const dismissNotification = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const logActivity = useCallback(
    (type: Activity['type'], message: string) => {
      const storageKey = getActivityStorageKey();
      if (!storageKey) return; // Don't log if no user

      const newActivity: Activity = {
        id: `${Date.now()}-${Math.random()}`,
        type,
        message,
        timestamp: new Date().toISOString(),
      };

      setActivities((prevActivities) => {
        const updatedActivities = [newActivity, ...prevActivities].slice(
          0,
          MAX_ACTIVITIES
        );
        try {
          localStorage.setItem(storageKey, JSON.stringify(updatedActivities));
        } catch (error) {
          console.error('Failed to save activities to localStorage', error);
        }
        return updatedActivities;
      });
    },
    [getActivityStorageKey]
  );

  const value = useMemo(
    () => ({
      title,
      setTitle,
      confirmation,
      showConfirmation,
      hideConfirmation,
      notifications,
      addNotification,
      dismissNotification,
      clearAllNotifications,
      showNotifications,
      setShowNotifications,
      activities,
      logActivity,
    }),
    [
      title,
      confirmation,
      notifications,
      showNotifications,
      activities,
      showConfirmation,
      hideConfirmation,
      addNotification,
      dismissNotification,
      clearAllNotifications,
      logActivity,
    ]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
