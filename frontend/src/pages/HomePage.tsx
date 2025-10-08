import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-blue-600 mb-2">
            Welcome! 👋
          </CardTitle>
          <CardDescription className="text-lg">
            This is a public route accessible to everyone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            {user 
              ? `You're already signed in as ${user.name || user.email}!` 
              : "You're viewing this page as a guest."
            }
          </p>
          
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                <Button 
                  onClick={() => navigate('/hello')} 
                  className="w-full"
                  size="lg"
                >
                  Go to Protected Hello Page
                </Button>
                <Button 
                  onClick={() => navigate('/profile')} 
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  View Profile
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/signin')} 
                  className="w-full"
                  size="lg"
                >
                  Sign In
                </Button>
                <p className="text-sm text-center text-gray-500">
                  Sign in to access protected routes
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomePage;

