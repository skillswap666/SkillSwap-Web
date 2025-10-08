import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import {
  Home,
  LayoutDashboard,
  CreditCard,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  LogIn,
} from 'lucide-react';

export function Navigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const navItems = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto w-full px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/home')}
          >
            <img src="/Logo.png" alt="Skill Swap Club" className="h-12 w-auto" />
          </div>

          {/* Nav Links */}
          <nav className="flex items-center space-x-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end>
                {({ isActive }) => (
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{label}</span>
                  </Button>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <CreditCard className="w-3 h-3" />
                <span>{user.credits}</span>
              </Badge>
            )}

            {/* Dark Mode */}
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
                  onClick={() => navigate('/dashboard')}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.profilePicture || ''} alt={user.name} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>

                  <div className="hidden xl:block">
                    <p className="text-sm font-medium">{user.name}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden xl:flex"
                >
                  <LogOut className="w-4 h-4 mr-1" /> Sign Out
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => navigate('/signin')}>
                <LogIn className="w-4 h-4 mr-1" /> Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="px-4 py-2 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/home')}
          >
            <img src="/Logo.png" alt="Skill Swap Club" className="h-10 w-auto" />
            <span className="font-bold text-lg text-blue-600">SkillSwap</span>
          </div>

          <div className="flex items-center space-x-3">
            {user && (
              <Badge variant="secondary" className="flex items-center space-x-1 text-xs">
                <CreditCard className="w-3 h-3" />
                <span>{user.credits}</span>
              </Badge>
            )}

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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 w-full rounded-md px-3 py-2 text-sm ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </NavLink>
              ))}

              <div className="pt-3 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="w-full justify-start flex items-center space-x-3"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </Button>

                {user ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start flex items-center space-x-3"
                  >
                    <LogOut className="w-4 h-4" /> <span>Sign Out</span>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate('/signin');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start flex items-center space-x-3"
                  >
                    <LogIn className="w-4 h-4" /> <span>Sign In</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
