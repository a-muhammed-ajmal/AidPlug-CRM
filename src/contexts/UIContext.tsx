import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useAuth } from './AuthContext';

// EXPORTED so other files can use it
export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

// EXPORTED so other files can use it
export interface Activity {
  id: string;
  type:
    | 'lead_add'
    | 'lead_update'
    | 'lead_delete'
    | 'lead_convert'
    | 'client_add'
    | 'deal_add'
    | 'deal_stage_update'
    | 'deal_delete'
    | 'task_add'
    | 'task_complete';
  message: string;
  timestamp: string;
}

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface UIContextType {
  title: string;
  setTitle: (title: string) => void;
  confirmation: ConfirmationState;
  showConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void
  ) => void;
  hideConfirmation: () => void;
  notifications: Notification[];
  addNotification: (title: string, message: string) => void;
  dismissNotification: (id: number) => void;
  clearAllNotifications: () => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  activities: Activity[];
  logActivity: (type: Activity['type'], message: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

// EXPORTED so other files can use it
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

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

  const logActivity = useCallback((type: Activity['type'], message: string) => {
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
        localStorage.setItem(
          storageKey,
          JSON.stringify(updatedActivities)
        );
      } catch (error) {
        console.error('Failed to save activities to localStorage', error);
      }
      return updatedActivities;
    });
  }, [getActivityStorageKey]);

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
