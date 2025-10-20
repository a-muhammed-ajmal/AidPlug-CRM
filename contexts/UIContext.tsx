import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

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
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

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
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};