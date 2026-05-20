import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

// Konfigurasi Axios agar otomatis mengirimkan token session/cookie Laravel
axios.defaults.withCredentials = true;

interface LoginProps {
    onLogin: () => void;
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    error: string;
}

interface DashboardProps {
    tasks: any[];
    onToggle: (id: number) => void;
    alertDue: boolean;
    onLogout: () => void;
    onAdd: () => void;
    desc: string;
    setDesc: (v: string) => void;
    date: string;
    setDate: (v: string) => void;
    priority: string;
    setPriority: (v: string) => void;
    setSort?: (v: string) => void;
}

// ========================================================
// 1. ADAPTIVE AUTH/LOGIN VIEWS
// ========================================================

const SmartphoneLogin = ({ onLogin, email, setEmail, password, setPassword, error }: LoginProps) => (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center p-4 bg-primary text-white">
        <div className="text-center mb-4">
            <h2 className="fw-bold text-white">Turboly Mobile</h2>
            <p className="small text-white-50">Please sign in to manage your tasks</p>
        </div>
        <div className="card text-dark p-3 shadow-lg border-0">
            {error && <div className="alert alert-danger p-2 small">{error}</div>}
            <div className="mb-3">
                <label className="form-label small fw-bold">Email Address</label>
                <input type="email" className="form-control form-control-lg" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="mb-4">
                <label className="form-label small fw-bold">Password</label>
                <input type="password" className="form-control form-control-lg" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-lg w-100 fw-bold" onClick={onLogin}>Sign In</button>
        </div>
    </div>
);

const TabletLogin: React.FC<LoginProps> = ({ onLogin, email, setEmail, password, setPassword, error }) => (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="row w-100 shadow-sm border rounded bg-white overflow-hidden" style={{ maxWidth: '600px' }}>
            <div className="col-12 p-5">
                <h3 className="text-secondary mb-3 text-center">Tablet Task Portal</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button className="btn btn-dark w-100 py-2" onClick={onLogin}>Access Hub</button>
            </div>
        </div>
    </div>
);

const DesktopLogin: React.FC<LoginProps> = ({ onLogin, email, setEmail, password, setPassword, error }) => (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
        <div className="card p-5 shadow border-0" style={{ width: '450px' }}>
            <div className="text-center mb-4">
                <h3 className="fw-bold text-dark">Enterprise Workspace</h3>
                <span className="text-muted small">Recruitment Coding Challenge Console</span>
            </div>
            {error && <div className="alert alert-danger small">{error}</div>}
            <div className="form-floating mb-3">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating mb-4">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <label htmlFor="floatingPassword">Password</label>
            </div>
            <button className="btn btn-primary w-100 py-2 fw-semibold" onClick={onLogin}>Authenticate Session</button>
        </div>
    </div>
);

// ========================================================
// 2. ADAPTIVE DASHBOARD VIEWS
// ========================================================

const SmartphoneDashboard: React.FC<DashboardProps> = ({ tasks, onToggle, alertDue, onLogout, onAdd, desc, setDesc, date, setDate, priority, setPriority }) => (
    <div className="container-fluid py-3 bg-light min-vh-100">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold text-primary mb-0">Mobile Task Manager</h6>
            <button className="btn btn-sm btn-outline-danger px-2" onClick={onLogout}>Logout</button>
        </div>

        {alertDue && <div className="alert alert-danger text-center fw-bold small p-2 mb-3">⚠️ Tugas HARI INI belum selesai!</div>}

        <div className="card p-3 mb-3 border-0 shadow-sm">
            <input type="text" className="form-control form-control-sm mb-2" placeholder="Tugas baru..." value={desc} onChange={e => setDesc(e.target.value)} />
            <div className="row g-1">
                <div className="col-7"><input type="date" className="form-control form-control-sm" value={date} onChange={e => setDate(e.target.value)} /></div>
                <div className="col-5">
                    <select className="form-select form-select-sm" value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>
            <button className="btn btn-sm btn-primary w-100 mt-2" onClick={onAdd}>+ Simpan</button>
        </div>

        <div className="d-flex flex-column gap-2">
            {tasks.map(task => (
                <div key={task.id} className={`card shadow-sm ${task.is_completed ? 'opacity-50' : ''}`}>
                    <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start">
                            <span className={task.is_completed ? 'text-decoration-line-through text-muted' : 'fw-bold'}>{task.description}</span>
                            <span className={`badge bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'secondary'}`}>{task.priority}</span>
                        </div>
                        <div className="text-muted small mt-1">Due: {task.due_date}</div>
                        <button className={`btn btn-sm w-100 mt-2 ${task.is_completed ? 'btn-secondary' : 'btn-success'}`} onClick={() => onToggle(task.id)}>
                            {task.is_completed ? 'Undo' : 'Mark Complete'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const TabletDashboard: React.FC<DashboardProps> = ({ tasks, onToggle, alertDue, onLogout, onAdd, desc, setDesc, date, setDate, priority, setPriority }) => (
    <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="text-secondary mb-0">Tablet Task Hub</h3>
            <button className="btn btn-outline-dark" onClick={onLogout}>Disconnect</button>
        </div>
        {alertDue && <div className="alert alert-warning text-center fw-bold mb-4">🔔 Perhatian: Ada tugas jatuh tempo hari ini!</div>}

        <div className="card p-4 mb-4 shadow-sm bg-white border-0">
            <div className="row g-2">
                <div className="col-6"><input type="text" className="form-control" placeholder="Deskripsi tugas" value={desc} onChange={e => setDesc(e.target.value)} /></div>
                <div className="col-3"><input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} /></div>
                <div className="col-3">
                    <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>
            <button className="btn btn-info w-100 mt-3 text-white fw-semibold" onClick={onAdd}>Create New Task</button>
        </div>

        <div className="row g-3">
            {tasks.map(task => (
                <div key={task.id} className="col-6">
                    <div className="card h-100 border-start border-4 border-info shadow-sm">
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h6 className={task.is_completed ? 'text-decoration-line-through text-muted' : ''}>{task.description}</h6>
                                <p className="small text-muted mb-1">Due: {task.due_date}</p>
                                <span className="badge bg-dark mb-3">{task.priority}</span>
                            </div>
                            <button className="btn btn-outline-primary btn-sm w-100" onClick={() => onToggle(task.id)}>
                                {task.is_completed ? 'Set Incomplete' : 'Done'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const DesktopDashboard: React.FC<DashboardProps> = ({ tasks, onToggle, alertDue, setSort, onLogout, onAdd, desc, setDesc, date, setDate, priority, setPriority }) => (
    <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
                <h2 className="text-dark fw-bold mb-0">Enterprise Task Console</h2>
                <span className="text-muted">Welcome back, authenticated operative.</span>
            </div>
            <button className="btn btn-danger px-4 shadow-sm" onClick={onLogout}>Secure Logout</button>
        </div>

        {alertDue && (
            <div className="alert alert-danger d-flex align-items-center justify-content-between shadow-sm mb-4" role="alert">
                <div><strong>Notice:</strong> You have critical tasks due today. Please action them immediately.</div>
            </div>
        )}

        <div className="card p-4 shadow-sm mb-4 border-0 bg-light">
            <h5 className="mb-3 text-secondary fw-semibold">Add New Record</h5>
            <div className="row g-3 align-items-end">
                <div className="col-5">
                    <label className="form-label small text-muted">Task Description</label>
                    <input type="text" className="form-control" value={desc} onChange={e => setDesc(e.target.value)} />
                </div>
                <div className="col-3">
                    <label className="form-label small text-muted">Due Date</label>
                    <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="col-2">
                    <label className="form-label small text-muted">Priority Level</label>
                    <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="col-2">
                    <button className="btn btn-primary w-100 py-2" onClick={onAdd}>Insert Task</button>
                </div>
            </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mb-3">
            <button className="btn btn-sm btn-outline-secondary px-3" onClick={() => setSort && setSort('due_date')}>Sort by Due Date</button>
            <button className="btn btn-sm btn-outline-secondary px-3" onClick={() => setSort && setSort('description')}>Sort by Name</button>
            <button className="btn btn-sm btn-outline-secondary px-3" onClick={() => setSort && setSort('priority')}>Sort by Priority</button>
        </div>

        <div className="card shadow-sm border-0">
            <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th style={{ width: '80px' }}>Status</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Priority</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id} className={task.is_completed ? 'table-light' : ''}>
                            <td>
                                <input type="checkbox" className="form-check-input pointer" checked={task.is_completed} onChange={() => onToggle(task.id)} />
                            </td>
                            <td className={task.is_completed ? 'text-decoration-line-through text-muted' : 'fw-semibold'}>{task.description}</td>
                            <td>{task.due_date}</td>
                            <td>
                                <span className={`badge p-2 bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'info'}`}>{task.priority.toUpperCase()}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// ========================================================
// 3. MAIN APPLICATION MANAGER
// ========================================================

const App = () => {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [alertDue, setAlertDue] = useState(false);
    const [sortBy, setSortBy] = useState('due_date');
    const [loading, setLoading] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    const [desc, setDesc] = useState('');
    const [date, setDate] = useState('');
    const [priority, setPriority] = useState('medium');

    const device = (window as any).deviceType || 'desktop';

    useEffect(() => {
        checkUserSession();
    }, []);

    useEffect(() => {
        if (user) fetchTasks();
    }, [user, sortBy]);

    const checkUserSession = async () => {
        try {
            const res = await axios.get('/api/user');
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setAuthError('');
        try {
            const res = await axios.post('/api/login', { email, password });
            setUser(res.data.user);
        } catch (err: any) {
            setAuthError(err.response?.data?.message || 'Login credentials failed.');
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
            setUser(null);
            setTasks([]);
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/api/tasks?sort_by=${sortBy}`);
            setTasks(response.data.tasks);
            setAlertDue(response.data.alert_due_today);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const handleAddTask = async () => {
        if (!desc || !date) return alert('Mohon isi semua kolom tugas.');
        try {
            await axios.post('/api/tasks', { description: desc, due_date: date, priority });
            setDesc('');
            setDate('');
            setPriority('medium');
            fetchTasks();
        } catch (err) {
            console.error("Gagal menambah task", err);
        }
    };

    const handleToggleComplete = async (id: number) => {
        try {
            await axios.patch(`/api/tasks/${id}/toggle`);
            fetchTasks();
        } catch (error) {
            console.error("Error updating task", error);
        }
    };

    if (loading) return <div className="d-flex min-vh-100 align-items-center justify-content-center">Loading Workspace...</div>;

    if (!user) {
        switch (device) {
            case 'smartphone': return <SmartphoneLogin onLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword} error={authError} />;
            case 'tablet': return <TabletLogin onLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword} error={authError} />;
            case 'desktop':
            default: return <DesktopLogin onLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword} error={authError} />;
        }
    }

    switch (device) {
        case 'smartphone':
            return <SmartphoneDashboard tasks={tasks} onToggle={handleToggleComplete} alertDue={alertDue} onLogout={handleLogout} onAdd={handleAddTask} desc={desc} setDesc={setDesc} date={date} setDate={setDate} priority={priority} setPriority={setPriority} />;
        case 'tablet':
            return <TabletDashboard tasks={tasks} onToggle={handleToggleComplete} alertDue={alertDue} onLogout={handleLogout} onAdd={handleAddTask} desc={desc} setDesc={setDesc} date={date} setDate={setDate} priority={priority} setPriority={setPriority} />;
        case 'desktop':
        default:
            return <DesktopDashboard tasks={tasks} onToggle={handleToggleComplete} alertDue={alertDue} setSort={setSortBy} onLogout={handleLogout} onAdd={handleAddTask} desc={desc} setDesc={setDesc} date={date} setDate={setDate} priority={priority} setPriority={setPriority} />;
    }
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);