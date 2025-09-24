import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  Home, 
  Search, 
  Calendar, 
  Plus, 
  LayoutDashboard, 
  CreditCard, 
  Trophy, 
  MessageSquare, 
  Settings,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Search },
  { id: 'create', label: 'Create', icon: Plus },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'credits', label: 'Credits', icon: CreditCard },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Navigation() {
  const { user, currentPage, setCurrentPage, isDarkMode, toggleDarkMode, isAuthenticated, signOut } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto w-full px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <h1 className="text-xl font-semibold">Skill Swap Club</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.slice(0, 7).map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(item.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <CreditCard className="w-3 h-3" />
                <span>{user.credits}</span>
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="w-9 h-9 p-0"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                <div 
                  className="flex items-center space-x-2 cursor-pointer" 
                  onClick={() => setCurrentPage('dashboard')}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="hidden xl:block">
                    <p className="text-sm font-medium">{user.name}</p>
                  </div>
                </div>
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="hidden xl:flex"
                  >
                    Sign Out
                  </Button>
                )}
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setCurrentPage('auth')}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">SS</span>
            </div>
            <h1 className="text-lg font-semibold">Skill Swap</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="flex items-center space-x-1 text-xs">
              <CreditCard className="w-3 h-3" />
              <span>{user.credits}</span>
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-8 h-8 p-0"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start flex items-center space-x-3"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              
              <div className="pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="w-full justify-start flex items-center space-x-3"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </Button>
                
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start flex items-center space-x-3"
                  >
                    <span>Sign Out</span>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentPage('auth');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start flex items-center space-x-3"
                  >
                    <span>Sign In</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}