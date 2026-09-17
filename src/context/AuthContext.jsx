import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);
const TOKEN_KEY = 'cuvasol_auth_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setLoading(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${savedToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.isAuthenticated && data.user) {
          setUser(data.user);
          setToken(savedToken);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
          setToken('');
        }
      })
      .catch(err => {
        console.error('Auth check error:', err);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setToken('');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
      showToast(`Welcome back, ${data.user.name}! 🚀`, 'success');
      return data.user;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const demoLogin = async () => {
    try {
      const res = await fetch('/api/auth/demo-login', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo login failed');

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
      showToast(`Logged in as Demo Agent: ${data.user.name} ⚡`, 'success');
      return data.user;
    } catch (err) {
      showToast(err.message || 'Demo login failed', 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
      showToast(`Agent Account Activated! Welcome, ${data.user.name}! 🎉`, 'success');
      return data.user;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setUser(data.user);
      showToast('Agent profile updated successfully! ✨', 'success');
      return data.user;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setToken('');
      showToast('Signed out of Agent Cloud', 'info');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      loading,
      login,
      demoLogin,
      register,
      updateProfile,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
