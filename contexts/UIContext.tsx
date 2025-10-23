import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, PropsWithChildren } from 'react';

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface Activity {
  id: string;
  type: 'lead_add' | 'lead_update' | 'lead_delete' | 'lead_convert' | 'client_add' | 'deal_add' | 'deal_stage_update' | 'deal_delete' | 'task_add' | 'task_complete';
  message: string;
  timestamp: string;
}

interface UIContextType {
  confirmation: ConfirmationState;
  showConfirmation: (title: string, message: string, onConfirm: () => void) => void;
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

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

const ACTIVITY_STORAGE_KEY = 'aidplug-crm-activities';
const MAX_ACTIVITIES = 30;

// FIX: Updated component definition to use React.FC<PropsWithChildren<{}>> to resolve children prop typing error.
export const UIProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
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

  useEffect(() => {
    try {
      const storedActivities = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (storedActivities) {
        setActivities(JSON.parse(storedActivities));
      }
    } catch (error) {
      console.error("Failed to load activities from localStorage", error);
    }
  }, []);

  const hideConfirmation = useCallback(() => {
    setConfirmation(prev => ({ ...prev, isOpen: false }));
  }, []);

  const showConfirmation = useCallback((title: string, message: string, onConfirm: () => void) => {
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
  }, [hideConfirmation]);

  const addNotification = useCallback((title: string, message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      title,
      message,
      time: 'Just now',
      unread: true,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const dismissNotification = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }, []);

  const logActivity = useCallback((type: Activity['type'], message: string) => {
    const newActivity: Activity = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: new Date().toISOString(),
    };
    
    setActivities(prevActivities => {
      const updatedActivities = [newActivity, ...prevActivities].slice(0, MAX_ACTIVITIES);
      try {
        localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updatedActivities));
      } catch (error) {
        console.error("Failed to save activities to localStorage", error);
      }
      return updatedActivities;
    });
  }, []);


  const value = {
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
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};