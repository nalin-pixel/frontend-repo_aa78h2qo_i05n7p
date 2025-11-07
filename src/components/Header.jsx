import React from 'react';
import { LogOut } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="w-full border-b border-neutral-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white grid place-items-center font-bold">TF</div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Task Forge</h1>
            <p className="text-xs text-neutral-500">Craft your tasks into achievements</p>
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-700 hidden sm:block">Welcome, <span className="font-medium">{user.name}</span></span>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
