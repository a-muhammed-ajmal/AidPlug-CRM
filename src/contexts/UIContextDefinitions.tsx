import { createContext, useContext } from 'react';

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

export const UIContext = createContext<UIContextType | undefined>(undefined);

// EXPORTED so other files can use it
export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};