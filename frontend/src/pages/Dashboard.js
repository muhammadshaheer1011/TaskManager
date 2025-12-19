import { useEffect, useState } from 'react';
import api from '../api/axios';
import TaskForm from '../components/TaskForm';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const { data } = await api.put(`/tasks/${task._id}`, { status: newStatus });
    setTasks(tasks.map(t => (t._id === task._id ? data : t)));
  };

  const updateTask = async (updatedTask) => {
    try {
      const { data } = await api.put(`/tasks/${updatedTask._id}`, updatedTask);
      setTasks(tasks.map(t => (t._id === data._id ? data : t)));
      setEditingTask(null);
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Dashboard</h1>
            <p className="text-slate-500 text-sm">Manage your workflow and productivity</p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm hover:bg-red-950/30 hover:text-red-400 hover:border-red-900/50 transition-all"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-4">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 sticky top-6">
              <h2 className="text-xl font-semibold mb-6 text-indigo-400">
                {editingTask ? '📝 Edit Task' : '✨ Create New Task'}
              </h2>
              <TaskForm
                editingTask={editingTask}
                onAdd={(newTask) => setTasks([newTask, ...tasks])}
                onUpdate={updateTask}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-8 space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600">
                No tasks found. Add one to get started!
              </div>
            ) : (
              tasks.map(task => (
                <div
                  key={task._id}
                  className="group bg-slate-900/50 border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-500/40 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className={`text-lg font-medium transition-all ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </h3>
                      {/* Dynamic Status Badge */}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border ${
                        task.status === 'completed' 
                          ? 'bg-green-500/10 border-green-500/50 text-green-500' 
                          : task.status === 'in-progress' 
                          ? 'bg-blue-500/10 border-blue-500/50 text-blue-500'
                          : 'bg-slate-500/10 border-slate-500/50 text-slate-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1">{task.description}</p>
                    <p className="text-[11px] text-indigo-400/70 font-mono">
                      📅 Due: {new Date(task.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => toggleStatus(task)}
                      className={`flex-1 sm:flex-none px-4 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                        task.status === 'completed' 
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                        : 'bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white border border-green-600/30'
                      }`}
                    >
                      {task.status === 'completed' ? 'Undo' : 'Complete'}
                    </button>

                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all"
                      title="Edit Task"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => deleteTask(task._id)}
                      className="p-2 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                      title="Delete Task"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}