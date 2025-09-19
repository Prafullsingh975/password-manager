import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './context/auth';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';


const AppRouter: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">Authenticating...</div>
    }
    
    return (
        <Routes>
            <Route path="/" element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
    );
}

function App() {
  return (
    <AuthProvider>
        <Toaster position="bottom-right" toastOptions={{
            style: {
                background: '#334155', // slate-700
                color: '#fff',
            }
        }}/>
        <Router>
            <AppRouter />
        </Router>
    </AuthProvider>
  );
}

export default App;

