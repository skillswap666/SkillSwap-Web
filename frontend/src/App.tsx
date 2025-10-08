import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigation } from './pages/Navigation';
import { Dashboard } from './pages/Dashboard';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';



// ------------------------------------
// ProtectedRoute
// ------------------------------------
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/signin" replace />;
}

// ------------------------------------
// Main App Layout
// ------------------------------------
function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 lg:pt-24">
        <Routes>
          {/* Redirect root "/" → /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Public Routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all → redirect to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </div>
  );
}

// ------------------------------------
// Main App
// ------------------------------------
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
