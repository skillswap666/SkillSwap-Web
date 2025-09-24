import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User,
  Eye,
  EyeOff
} from 'lucide-react';

export function AuthPage() {
  const { signIn, signUp, isLoading } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign In Form
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  // Sign Up Form
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(signInData.email, signInData.password);
    } catch (error) {
      // Error is handled in the context
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (signUpData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await signUp(signUpData.name, signUpData.email, signUpData.password);
    } catch (error) {
      // Error is handled in the context
    }
  };

  const updateSignInData = (field: string, value: string) => {
    setSignInData(prev => ({ ...prev, [field]: value }));
  };

  const updateSignUpData = (field: string, value: string) => {
    setSignUpData(prev => ({ ...prev, [field]: value }));
  };

  // Demo account button
  const handleDemoSignIn = async () => {
    try {
      await signIn('demo@skillswapclub.com', 'demo123');
    } catch (error) {
      // If demo account doesn't exist, we'll stay in demo mode
      console.log('Demo account not found, continuing with mock data');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            {/* [] to change to logo  */}
            <span className="text-white font-bold text-xl">SS</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to Skill Swap Club</h1>
          <p className="text-muted-foreground">
            Join our community to learn new skills and share your expertise
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* SignIn */}
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={signInData.email}
                        onChange={(e) => updateSignInData('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Your password"
                        value={signInData.password}
                        onChange={(e) => updateSignInData('password', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background text-muted-foreground">Or try demo</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={handleDemoSignIn}
                    disabled={isLoading}
                  >
                    Continue with Demo Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign up */}

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your full name"
                        value={signUpData.name}
                        onChange={(e) => updateSignUpData('name', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={signUpData.email}
                        onChange={(e) => updateSignUpData('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Choose a password"
                        value={signUpData.password}
                        onChange={(e) => updateSignUpData('password', e.target.value)}
                        className="pl-10 pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => updateSignUpData('confirmPassword', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>

                <div className="mt-4">
                  <p className="text-xs text-muted-foreground text-center">
                    By creating an account, you get 50 free credits to start attending workshops!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Join thousands of learners and experts in our skill-sharing community
          </p>
        </div>
      </div>
    </div>
  );
}