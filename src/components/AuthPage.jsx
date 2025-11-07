import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';

const AuthPage = ({ onLogin, onRegister, loading, error }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = (e) => {
    e.preventDefault();
    if (mode === 'login') onLogin({ email: form.email, password: form.password });
    else onRegister(form);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 via-white to-rose-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight mb-1 text-center">{mode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
        <p className="text-sm text-neutral-500 text-center mb-6">{mode === 'login' ? 'Sign in to manage your tasks' : 'Join Task Forge and start crafting tasks'}</p>

        {error && (
          <div className="mb-4 rounded-md bg-rose-50 border border-rose-200 px-3 py-2 text-rose-700 text-sm">{error}</div>
        )}

        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                placeholder="Full name"
                className="w-full rounded-md border border-neutral-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-md border border-neutral-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-md border border-neutral-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 text-white py-2 text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-neutral-600">
          {mode === 'login' ? (
            <span>
              New here?{' '}
              <button className="text-indigo-600 hover:underline font-medium" onClick={() => setMode('register')}>Create an account</button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button className="text-indigo-600 hover:underline font-medium" onClick={() => setMode('login')}>Sign in</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
