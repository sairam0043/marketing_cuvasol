import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toast-container">
        {toasts.map(t => {
          let icon = 'ℹ️';
          if (t.type === 'success') icon = '✅';
          else if (t.type === 'error') icon = '❌';
          else if (t.type === 'warning') icon = '⚠️';

          return (
            <div key={t.id} className={`toast toast-${t.type}`}>
              <span style={{ fontSize: '1.1rem' }}>{icon}</span>
              <span style={{ flexGrow: 1, fontWeight: 500 }}>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
