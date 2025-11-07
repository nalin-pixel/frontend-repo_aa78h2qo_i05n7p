import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Header from './Header';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import axios from 'axios';

// Auth Context
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('tf_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('tf_token'));

  const login = async (email, password) => {
    const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL || ''}/api/users/login`, { email, password });
    setUser(data);
    setToken(data.token);
    localStorage.setItem('tf_user', JSON.stringify(data));
    localStorage.setItem('tf_token', data.token);
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL || ''}/api/users`, { name, email, password });
    setUser(data);
    setToken(data.token);
    localStorage.setItem('tf_user', JSON.stringify(data));
    localStorage.setItem('tf_token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tf_user');
    localStorage.removeItem('tf_token');
  };

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Task Context
const TaskContext = createContext(null);
export const useTasks = () => useContext(TaskContext);

const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL || '' });

export const TaskProvider = ({ children }) => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const authHeader = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/tasks', { headers: authHeader });
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (payload) => {
    const { data } = await api.post('/api/tasks', payload, { headers: authHeader });
    setTasks((prev) => [data, ...prev]);
  };

  const updateTask = async (id, payload) => {
    const { data } = await api.put(`/api/tasks/${id}`, payload, { headers: authHeader });
    setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
  };

  const deleteTask = async (id) => {
    await api.delete(`/api/tasks/${id}`, { headers: authHeader });
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const value = useMemo(() => ({ tasks, loading, fetchTasks, addTask, updateTask, deleteTask }), [tasks, loading]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// UI Components inside Dashboard file
const PriorityBadge = ({ priority }) => {
  const map = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-rose-100 text-rose-700',
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[priority] || ''}`}>{priority}</span>;
};

const TaskCard = ({ task, onEdit, onDelete }) => (
  <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm space-y-2">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h4 className="font-medium leading-tight">{task.title}</h4>
        {task.description && <p className="text-sm text-neutral-600 mt-1">{task.description}</p>}
      </div>
      <PriorityBadge priority={task.priority} />
    </div>
    <div className="flex items-center justify-between text-xs text-neutral-500">
      {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
      <div className="flex items-center gap-2">
        <button onClick={() => onEdit(task)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200">
          <Pencil size={14} /> Edit
        </button>
        <button onClick={() => onDelete(task._id)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100">
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  </div>
);

const EditTaskModal = ({ open, task, onClose, onSave }) => {
  const [form, setForm] = useState(task || {});
  useEffect(() => setForm(task || {}), [task]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Edit Task</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-neutral-100"><X size={18} /></button>
        </div>
        <div className="grid gap-3">
          <input className="border rounded px-3 py-2 text-sm" value={form.title || ''} onChange={(e)=>setForm({ ...form, title: e.target.value })} placeholder="Title" />
          <textarea className="border rounded px-3 py-2 text-sm" value={form.description || ''} onChange={(e)=>setForm({ ...form, description: e.target.value })} placeholder="Description" />
          <div className="grid grid-cols-3 gap-3">
            <select className="border rounded px-3 py-2 text-sm" value={form.priority || 'low'} onChange={(e)=>setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select className="border rounded px-3 py-2 text-sm" value={form.status || 'todo'} onChange={(e)=>setForm({ ...form, status: e.target.value })}>
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <input type="date" className="border rounded px-3 py-2 text-sm" value={form.dueDate ? form.dueDate.substring(0,10) : ''} onChange={(e)=>setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-2 text-sm rounded border">Cancel</button>
            <button onClick={() => onSave(form)} className="px-3 py-2 text-sm rounded bg-indigo-600 text-white">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskForm = () => {
  const { addTask } = useTasks();
  const [form, setForm] = useState({ title: '', description: '', priority: 'low', status: 'todo', dueDate: '' });

  const submit = async (e) => {
    e.preventDefault();
    await addTask(form);
    setForm({ title: '', description: '', priority: 'low', status: 'todo', dueDate: '' });
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm grid gap-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2 text-sm" placeholder="Task title" value={form.title} onChange={(e)=>setForm({ ...form, title: e.target.value })} required />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Description" value={form.description} onChange={(e)=>setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="grid sm:grid-cols-4 gap-3">
        <select className="border rounded px-3 py-2 text-sm" value={form.priority} onChange={(e)=>setForm({ ...form, priority: e.target.value })}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select className="border rounded px-3 py-2 text-sm" value={form.status} onChange={(e)=>setForm({ ...form, status: e.target.value })}>
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input type="date" className="border rounded px-3 py-2 text-sm" value={form.dueDate} onChange={(e)=>setForm({ ...form, dueDate: e.target.value })} />
        <button className="inline-flex items-center justify-center gap-2 rounded bg-indigo-600 text-white px-3 py-2 text-sm font-medium hover:bg-indigo-700">
          <Plus size={16} /> Add Task
        </button>
      </div>
    </form>
  );
};

const KanbanBoard = () => {
  const { tasks, deleteTask, updateTask, loading } = useTasks();
  const [editing, setEditing] = useState(null);

  const openEdit = (task) => setEditing(task);
  const saveEdit = async (form) => {
    await updateTask(editing._id, form);
    setEditing(null);
  };

  const columns = [
    { key: 'todo', title: 'To Do' },
    { key: 'inProgress', title: 'In Progress' },
    { key: 'done', title: 'Done' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => (
        <div key={col.key} className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-700">{col.title}</h3>
            <span className="text-xs text-neutral-500">{tasks.filter(t => t.status === col.key).length}</span>
          </div>
          <div className="space-y-3">
            {tasks.filter(t => t.status === col.key).map((t) => (
              <TaskCard key={t._id} task={t} onEdit={openEdit} onDelete={deleteTask} />
            ))}
            {loading && <div className="text-sm text-neutral-500">Loading…</div>}
          </div>
        </div>
      ))}
      <EditTaskModal open={!!editing} task={editing} onClose={() => setEditing(null)} onSave={saveEdit} />
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-rose-50">
      <Header user={user} onLogout={logout} />
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        <TaskProvider>
          <TaskForm />
          <KanbanBoard />
        </TaskProvider>
      </main>
    </div>
  );
};

export default Dashboard;
