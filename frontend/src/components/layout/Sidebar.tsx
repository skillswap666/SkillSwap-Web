import React from 'react';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import {
  Home,
  BookOpen,
  Plus,
  User,
  CreditCard,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Workshops', href: '/workshops', icon: BookOpen },
  { name: 'Create Workshop', href: '/workshops/create', icon: Plus },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Credits', href: '/credits', icon: CreditCard },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { user, signOut } = useSupabaseAuth();
  const { sidebarOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className={cn(
      'fixed left-0 top-16 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40',
      sidebarOpen ? 'w-64' : 'w-16'
    )}>
      <div className="flex flex-col h-full">
        {/* User info */}
        {user && (
          <div className={cn(
            'p-4 border-b border-gray-200',
            !sidebarOpen && 'px-2'
          )}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.credits} credits
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  sidebarOpen ? 'px-3' : 'px-2',
                  isActive && 'bg-blue-50 text-blue-700'
                )}
                onClick={() => navigate(item.href)}
              >
                <item.icon className={cn('h-4 w-4', sidebarOpen && 'mr-3')} />
                {sidebarOpen && <span>{item.name}</span>}
              </Button>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50',
              sidebarOpen ? 'px-3' : 'px-2'
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn('h-4 w-4', sidebarOpen && 'mr-3')} />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};
