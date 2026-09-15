import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardLayout } from './pages/Dashboard/DashboardLayout';

function MainApp() {
  const { isAuthenticated, loading } = useAuth();
  const [route, setRoute] = useState('landing');
  const [dashTab, setDashTab] = useState('overview');

  // Sync with window.location.hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1) || 'landing';
      const [mainWithQuery, sub] = hash.split('/');
      const [main] = mainWithQuery.split('?');

      if (main === 'dashboard') {
        if (!isAuthenticated && !loading) {
          window.location.hash = '#login';
          setRoute('login');
          return;
        }
        setRoute('dashboard');
        setDashTab(sub || 'overview');
      } else {
        setRoute(main || 'landing');
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAuthenticated, loading]);

  const navigate = (newRoute, subTab = 'overview') => {
    if (newRoute === 'dashboard') {
      window.location.hash = `#dashboard/${subTab}`;
    } else {
      window.location.hash = `#${newRoute}`;
    }
  };

  const handleTabChange = (tab) => {
    setDashTab(tab);
    window.location.hash = `#dashboard/${tab}`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan-400)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="badge-pulse-dot" style={{ width: 16, height: 16, margin: '0 auto 1rem auto' }}></div>
          <p>Connecting to Cuvasol Agent Cloud...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Ambient Mesh Background */}
      <div className="bg-mesh">
        <div className="mesh-glow-1"></div>
        <div className="mesh-glow-2"></div>
        <div className="mesh-grid"></div>
      </div>

      {route === 'landing' && (
        <>
          <Navbar onNavigate={navigate} />
          <LandingPage onNavigate={navigate} />
        </>
      )}

      {route === 'login' && (
        <LoginPage onNavigate={navigate} />
      )}

      {route === 'signup' && (
        <SignupPage onNavigate={navigate} />
      )}

      {route === 'dashboard' && (
        <DashboardLayout
          activeTab={dashTab}
          onTabChange={handleTabChange}
          onNavigateLanding={() => navigate('landing')}
        />
      )}
    </>
  );
}

import { ThemeProvider } from './context/ThemeContext';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <MainApp />
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
export default App;
