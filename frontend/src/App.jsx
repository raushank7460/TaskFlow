import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:5000/api";

// ─── API HELPERS ──────────────────────────────────────────────────────────────
const req = async (method, url, body, token) => {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Kuch gadbad ho gayi");
  return data;
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, cls = "w-5 h-5" }) => {
  const icons = {
    task: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
    dashboard: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    user: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    logout: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
    plus: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    edit: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    trash: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    close: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    check: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    alert: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    clock: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    eye: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    eyeOff: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,
  };
  return icons[name] || null;
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium animate-bounce-in
      ${type === "success" ? "bg-emerald-500" : type === "error" ? "bg-rose-500" : "bg-amber-500"}`}>
      <Icon name={type === "success" ? "check" : "alert"} cls="w-4 h-4" />
      {msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><Icon name="close" cls="w-3 h-3" /></button>
    </div>
  );
};

// ─── INPUT ────────────────────────────────────────────────────────────────────
const Input = ({ label, type = "text", value, onChange, placeholder, required, icon, showToggle, onToggle, showPw }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>}
      <input
        type={showToggle ? (showPw ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500
          focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all
          ${icon ? "pl-10" : ""} ${showToggle ? "pr-10" : ""}`}
      />
      {showToggle && (
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-violet-400 transition-colors">
          <Icon name={showPw ? "eyeOff" : "eye"} cls="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color, sub }) => (
  <div className={`rounded-2xl p-5 border ${color} flex flex-col gap-2`}>
    <p className="text-xs font-semibold uppercase tracking-widest opacity-70">{label}</p>
    <p className="text-4xl font-black">{value}</p>
    {sub && <p className="text-xs opacity-60">{sub}</p>}
  </div>
);

// ─── BADGE ────────────────────────────────────────────────────────────────────
const Badge = ({ val, type }) => {
  const status = {
    pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    "in-progress": "bg-blue-500/15 text-blue-300 border-blue-500/30",
    completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  };
  const priority = {
    high: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    medium: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    low: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  };
  const map = type === "priority" ? priority : status;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${map[val] || "bg-slate-700 text-slate-300"}`}>
      {val}
    </span>
  );
};

// ─── LOGIN / REGISTER PAGE ────────────────────────────────────────────────────
const AuthPage = ({ onLogin, showToast }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isLogin ? "/user/login" : "/user/register";
      const body = isLogin ? { email: form.email, password: form.password } : form;
      const data = await req("POST", url, body);
      showToast(isLogin ? "Login successful! 🎉" : "Account bana diya! 🎉", "success");
      onLogin(data);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-600 rounded-2xl mb-4 shadow-lg shadow-violet-500/30">
            <Icon name="task" cls="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">TaskFlow</h1>
          <p className="text-slate-500 text-sm mt-1">Apne tasks manage karo efficiently</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex bg-slate-800/60 rounded-xl p-1 mb-7 gap-1">
            {["Login", "Register"].map((t, i) => (
              <button key={t} onClick={() => setIsLogin(i === 0)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all
                  ${(i === 0) === isLogin ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25" : "text-slate-400 hover:text-slate-200"}`}>
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            {!isLogin && (
              <Input label="Naam" value={form.name} onChange={set("name")} placeholder="Aapka naam" required />
            )}
            <Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="email@example.com" required />
            <Input label="Password" value={form.password} onChange={set("password")} placeholder="••••••••"
              required showToggle onToggle={() => setShowPw(!showPw)} showPw={showPw} />

            <button type="submit" disabled={loading}
              className="mt-2 w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  {isLogin ? "Login ho raha hai..." : "Account ban raha hai..."}
                </span>
              ) : isLogin ? "Login Karo" : "Account Banao"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
const DashboardPage = ({ token, showToast }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const d = await req("GET", "/dashboard", null, token);
      setData(d);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <svg className="w-8 h-8 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  );

  if (!data) return null;
  const { stats, recentTasks, dueTodayTasks, overdueTasks } = data;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-black text-white">Namaste, {data.user?.name} 👋</h2>
        <p className="text-slate-500 text-sm mt-1">Aaj ka overview dekho</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={stats.totalTasks} color="bg-slate-800/60 border-slate-700 text-slate-100" />
        <StatCard label="Pending" value={stats.pendingTasks} color="bg-amber-500/10 border-amber-500/20 text-amber-300" />
        <StatCard label="In Progress" value={stats.inProgressTasks} color="bg-blue-500/10 border-blue-500/20 text-blue-300" />
        <StatCard label="Completed" value={stats.completedTasks} color="bg-emerald-500/10 border-emerald-500/20 text-emerald-300" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="High Priority" value={stats.highPriority} color="bg-rose-500/10 border-rose-500/20 text-rose-300" />
        <StatCard label="Aaj Due" value={stats.dueTodayCount} color="bg-cyan-500/10 border-cyan-500/20 text-cyan-300" />
        <StatCard label="Overdue" value={stats.overdueCount} color="bg-red-500/10 border-red-500/20 text-red-300" sub={stats.overdueCount > 0 ? "Dhyan do!" : "Sab theek hai ✓"} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Recent Tasks</h3>
          {recentTasks.length === 0
            ? <p className="text-slate-600 text-sm text-center py-8">Koi task nahi hai</p>
            : <div className="space-y-3">
                {recentTasks.map((t) => (
                  <div key={t._id} className="flex items-center justify-between gap-3 p-3 bg-slate-800/40 rounded-xl">
                    <p className="text-sm text-slate-200 font-medium truncate">{t.title}</p>
                    <div className="flex gap-2 shrink-0">
                      <Badge val={t.priority} type="priority" />
                      <Badge val={t.status} />
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Overdue */}
        <div className="bg-slate-900/60 border border-rose-900/40 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Icon name="alert" cls="w-4 h-4" /> Overdue Tasks
          </h3>
          {overdueTasks.length === 0
            ? <p className="text-slate-600 text-sm text-center py-8">🎉 Koi overdue task nahi!</p>
            : <div className="space-y-3">
                {overdueTasks.map((t) => (
                  <div key={t._id} className="flex items-center justify-between gap-3 p-3 bg-rose-950/30 border border-rose-900/30 rounded-xl">
                    <div>
                      <p className="text-sm text-rose-200 font-medium">{t.title}</p>
                      <p className="text-xs text-rose-500 mt-0.5 flex items-center gap-1">
                        <Icon name="clock" cls="w-3 h-3" /> {new Date(t.dueDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <Badge val={t.priority} type="priority" />
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
};

// ─── TASK MODAL ───────────────────────────────────────────────────────────────
const TaskModal = ({ task, onClose, onSave, token, showToast }) => {
  const [form, setForm] = useState(
    task || { title: "", description: "", status: "pending", priority: "medium", dueDate: "" }
  );
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (task) {
        await req("PUT", `/task/${task._id}`, form, token);
        showToast("Task update ho gaya!", "success");
      } else {
        await req("POST", "/task", form, token);
        showToast("Naya task ban gaya!", "success");
      }
      onSave();
      onClose();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-white">{task ? "Task Update Karo" : "Naya Task Banao"}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1"><Icon name="close" /></button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Title" value={form.title} onChange={set("title")} placeholder="Task ka naam" required />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Description</label>
            <textarea value={form.description} onChange={set("description")} placeholder="Task ke baare mein likho..."
              rows={3} className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Status</label>
              <select value={form.status} onChange={set("status")}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-all">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Priority</label>
              <select value={form.priority} onChange={set("priority")}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-all">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Due Date</label>
            <input type="date" value={form.dueDate ? form.dueDate.slice(0, 10) : ""} onChange={set("dueDate")}
              className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-all" />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all font-semibold text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50">
              {loading ? "Saving..." : task ? "Update Karo" : "Banao"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── TASKS PAGE ───────────────────────────────────────────────────────────────
const TasksPage = ({ token, showToast }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState({ status: "", priority: "" });

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.set("status", filter.status);
      if (filter.priority) params.set("priority", filter.priority);
      const url = `/task${params.toString() ? "?" + params : ""}`;
      const data = await req("GET", url, null, token);
      setTasks(data);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => { load(); }, [load]);

  const deleteTask = async (id) => {
    if (!confirm("Kya aap pakka delete karna chahte hain?")) return;
    try {
      await req("DELETE", `/task/${id}`, null, token);
      showToast("Task delete ho gaya!", "success");
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const openEdit = (t) => { setEditTask(t); setModal(true); };
  const openNew = () => { setEditTask(null); setModal(true); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Mere Tasks</h2>
          <p className="text-slate-500 text-sm mt-1">{tasks.length} task{tasks.length !== 1 ? "s" : ""} mil{tasks.length !== 1 ? "e" : "a"}</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:-translate-y-0.5">
          <Icon name="plus" cls="w-4 h-4" /> Naya Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {["", "pending", "in-progress", "completed"].map((s) => (
          <button key={s} onClick={() => setFilter((f) => ({ ...f, status: s }))}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all
              ${filter.status === s ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25" : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"}`}>
            {s || "Sabhi"}
          </button>
        ))}
        <div className="w-px bg-slate-700" />
        {["", "high", "medium", "low"].map((p) => (
          <button key={p} onClick={() => setFilter((f) => ({ ...f, priority: p }))}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all
              ${filter.priority === p ? "bg-slate-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"}`}>
            {p || "All Priority"}
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <svg className="w-7 h-7 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <Icon name="task" cls="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Koi task nahi mila</p>
          <button onClick={openNew} className="mt-4 text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors">+ Pehla task banao</button>
        </div>
      ) : (
        <div className="grid gap-3">
          {tasks.map((t) => (
            <div key={t._id} className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 flex-wrap">
                  <p className={`text-base font-bold ${t.status === "completed" ? "line-through text-slate-500" : "text-white"}`}>
                    {t.title}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge val={t.priority} type="priority" />
                    <Badge val={t.status} />
                  </div>
                </div>
                {t.description && <p className="text-slate-500 text-sm mt-1.5 line-clamp-2">{t.description}</p>}
                {t.dueDate && (
                  <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                    <Icon name="clock" cls="w-3 h-3" />
                    Due: {new Date(t.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                <button onClick={() => openEdit(t)}
                  className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all">
                  <Icon name="edit" cls="w-4 h-4" />
                </button>
                <button onClick={() => deleteTask(t._id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                  <Icon name="trash" cls="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <TaskModal task={editTask} token={token} onClose={() => setModal(false)} onSave={load} showToast={showToast} />
      )}
    </div>
  );
};

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
const ProfilePage = ({ user, token, showToast, onUpdate }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email, password: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { name: form.name, email: form.email };
      if (form.password) body.password = form.password;
      const data = await req("PUT", "/user/profile", body, token);
      showToast("Profile update ho gayi!", "success");
      onUpdate(data);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <div className="mb-7">
        <h2 className="text-2xl font-black text-white">Meri Profile</h2>
        <p className="text-slate-500 text-sm mt-1">Apni details update karo</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-7">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-7 pb-7 border-b border-slate-800">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-violet-500/25">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold text-white">{user.name}</p>
            <p className="text-slate-500 text-sm">{user.email}</p>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-violet-500/15 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full mt-1 inline-block">
              {user.role || "user"}
            </span>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Naam" value={form.name} onChange={set("name")} placeholder="Aapka naam" required />
          <Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="email@example.com" required />
          <Input label="Naya Password (optional)" value={form.password} onChange={set("password")}
            placeholder="Khali chhoodo agar change na karna ho"
            showToggle onToggle={() => setShowPw(!showPw)} showPw={showPw} />

          <button type="submit" disabled={loading}
            className="mt-2 w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-violet-500/25">
            {loading ? "Update ho raha hai..." : "Profile Update Karo"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tm_user")); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("tm_token") || "");
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type, id: Date.now() });
  }, []);

  const handleLogin = (data) => {
    setUser(data);
    setToken(data.token);
    localStorage.setItem("tm_user", JSON.stringify(data));
    localStorage.setItem("tm_token", data.token);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("tm_user");
    localStorage.removeItem("tm_token");
  };

  const handleProfileUpdate = (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("tm_token", data.token);
    }
    localStorage.setItem("tm_user", JSON.stringify(updated));
  };

  if (!user || !token) return (
    <>
      <AuthPage onLogin={handleLogin} showToast={showToast} />
      {toast && <Toast key={toast.id} msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "tasks", label: "Tasks", icon: "task" },
    { id: "profile", label: "Profile", icon: "user" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Icon name="task" cls="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">TaskFlow</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setPage(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                ${page === item.id ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
              <Icon name={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white text-sm font-black">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
            <Icon name="logout" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Topbar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-5 py-4 bg-slate-900/80 border-b border-slate-800 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-black text-white">TaskFlow</span>
          </div>
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white text-sm font-black">
            {user.name?.[0]?.toUpperCase()}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          {page === "dashboard" && <DashboardPage token={token} showToast={showToast} />}
          {page === "tasks" && <TasksPage token={token} showToast={showToast} />}
          {page === "profile" && <ProfilePage user={user} token={token} showToast={showToast} onUpdate={handleProfileUpdate} />}
        </div>
      </main>

      {toast && <Toast key={toast.id} msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}