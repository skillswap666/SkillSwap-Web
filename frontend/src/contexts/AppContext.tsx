// gobal UI state context
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  notifications: any[];
  setNotifications: (notifications: any[]) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const value: AppContextType = {
    theme,
    setTheme,
    sidebarOpen,
    setSidebarOpen,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
