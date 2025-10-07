import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

const HelloPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-4xl font-bold text-purple-600 mb-2">
            Hello! 🎉
          </CardTitle>
          <CardDescription className="text-lg">
            This is a protected route - authentication required
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-xl font-semibold text-gray-800">
              Welcome back, {user?.name || 'User'}!
            </p>
            <p className="text-sm text-gray-600">
              {user?.email}
            </p>
            {user?.bio && (
              <p className="text-sm text-gray-500 italic mt-2">
                "{user.bio}"
              </p>
            )}
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-center text-green-600 font-medium mb-4">
              ✓ You are authenticated and can access this protected content
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => navigate('/profile')} 
              className="w-full"
              size="lg"
            >
              View Full Profile
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="w-full"
              size="lg"
            >
              Back to Welcome Page
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelloPage;

