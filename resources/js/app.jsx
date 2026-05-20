import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

// --- ADAPTIVE UI COMPONENTS ---

// 1. SMARTPHONE VIEW (Layout Ringkas, Stack Vertikal, Touch-friendly)
const SmartphoneDashboard = ({ tasks, onToggle, alertDue }) => (
    <div className="container-fluid py-3 bg-light min-vh-100">
        {alertDue && (
            <div className="alert alert-danger text-center fw-bold fs-7 mb-3" role="alert">
                ⚠️ Ada tugas yang harus diselesaikan HARI INI!
            </div>
        )}
        <h5 className="text-center mb-3 text-primary fw-bold">Mobile Task Manager</h5>
        <div className="d-flex flex-column gap-2">
            {tasks.map(task => (
                <div key={task.id} className={`card shadow-sm ${task.is_completed ? 'opacity-50' : ''}`}>
                    <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start">
                            <span className={`fw-bold ${task.is_completed ? 'text-decoration-line-through' : ''}`}>
                                {task.description}
                            </span>
                            <span className={`badge bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'secondary'}`}>
                                {task.priority}
                            </span>
                        </div>
                        <div className="text-muted small mt-2">Due: {task.due_date}</div>
                        <button 
                            className={`btn btn-sm w-100 mt-2 ${task.is_completed ? 'btn-secondary' : 'btn-success'}`}
                            onClick={() => onToggle(task.id)}
                        >
                            {task.is_completed ? 'Undo' : 'Mark Complete'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// 2. TABLET VIEW (Layout Medium, Grid 2 Kolom)
const TabletDashboard = ({ tasks, onToggle, alertDue }) => (
    <div className="container py-4">
        {alertDue && (
            <div className="alert alert-warning text-center fw-bold mb-4 animate-pulse">
                🔔 Perhatian: Anda memiliki tugas jatuh tempo hari ini!
            </div>
        )}
        <h3 className="mb-4 text-secondary">Tablet Task Hub</h3>
        <div className="row g-3">
            {tasks.map(task => (
                <div key={task.id} className="col-6">
                    <div className="card h-100 border-start border-4 border-info">
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h6 className={task.is_completed ? 'text-decoration-line-through text-muted' : ''}>
                                    {task.description}
                                </h6>
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

// 3. DESKTOP VIEW (Layout Lebar, Menggunakan Komponen Tabel Data Terstruktur)
const DesktopDashboard = ({ tasks, onToggle, alertDue, setSort }) => (
    <div className="container py-5">
        {alertDue && (
            <div className="alert alert-danger d-flex align-items-center justify-content-between shadow-sm" role="alert">
                <div><strong>Notice:</strong> You have critical tasks due today. Please action them immediately.</div>
            </div>
        )}
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-dark fw-bold">Enterprise Task Console</h2>
            <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setSort('due_date')}>Sort by Due Date</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setSort('description')}>Sort by Name</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setSort('priority')}>Sort by Priority</button>
            </div>
        </div>
        <div className="card shadow-sm">
            <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th>Status</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Priority</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id} className={task.is_completed ? 'table-light' : ''}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    className="form-check-input pointer" 
                                    checked={task.is_completed} 
                                    onChange={() => onToggle(task.id)} 
                                />
                            </td>
                            <td className={task.is_completed ? 'text-decoration-line-through text-muted' : 'fw-semibold'}>
                                {task.description}
                            </td>
                            <td>{task.due_date}</td>
                            <td>
                                <span className={`badge p-2 bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'info'}`}>
                                    {task.priority.toUpperCase()}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- MAIN APPLICATION MANAGER ---
const App = () => {
    const [tasks, setTasks] = useState([]);
    const [alertDue, setAlertDue] = useState(false);
    const [sortBy, setSortBy] = useState('due_date');
    const device = (window).deviceType || 'desktop';

    useEffect(() => {
        fetchTasks();
    }, [sortBy]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/api/tasks?sort_by=${sortBy}`);
            setTasks(response.data.tasks);
            setAlertDue(response.data.alert_due_today);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const handleToggleComplete = async (id) => {
        try {
            await axios.patch(`/api/tasks/${id}/toggle`);
            fetchTasks();
        } catch (error) {
            console.error("Error updating task", error);
        }
    };

    // Alokasi UI adaptif murni berbasis kondisi perangkat dari global state
    switch (device) {
        case 'smartphone':
            return <SmartphoneDashboard tasks={tasks} onToggle={handleToggleComplete} alertDue={alertDue} />;
        case 'tablet':
            return <TabletDashboard tasks={tasks} onToggle={handleToggleComplete} alertDue={alertDue} />;
        case 'desktop':
        default:
            return <DesktopDashboard tasks={tasks} onToggle={handleToggleComplete} alertDue={alertDue} setSort={setSortBy} />;
    }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);