import React, { useMemo, useState } from 'react';
import AuthPage from './components/AuthPage';
import Dashboard, { AuthProvider, useAuth } from './components/Dashboard';

// Simple Toast component (inline, not a separate file)
const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;
  const styles = {
    success: 'bg-emerald-600',
    error: 'bg-rose-600',
    info: 'bg-neutral-800',
  };
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 text-white px-4 py-2 rounded shadow ${styles[type]}`}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white text-xs">Dismiss</button>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { user, login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const handleLogin = async ({ email, password }) => {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setToast({ message: 'Signed in successfully', type: 'success' });
    } catch (e) {
      setError(e?.response?.data?.message || 'Unable to sign in');
      setToast({ message: 'Sign in failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ name, email, password }) => {
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      setToast({ message: 'Account created', type: 'success' });
    } catch (e) {
      setError(e?.response?.data?.message || 'Unable to register');
      setToast({ message: 'Registration failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {user ? (
        <Dashboard />
      ) : (
        <AuthPage onLogin={handleLogin} onRegister={handleRegister} loading={loading} error={error} />
      )}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
