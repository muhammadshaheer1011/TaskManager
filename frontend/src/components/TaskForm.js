import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function TaskForm({ onAdd, onUpdate, editingTask }) {
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending' // Added default status
  });

  useEffect(() => {
    if (editingTask) {
      setTask({
        title: editingTask.title,
        description: editingTask.description,
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
        status: editingTask.status || 'pending' // Load existing status
      });
    } else {
      setTask({ title: '', description: '', dueDate: '', status: 'pending' });
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTask) {
        // Mode: EDITING (Sends the chosen status)
        await onUpdate({ ...editingTask, ...task });
      } else {
        // Mode: CREATING (Sends the chosen status)
        const { data } = await api.post('/tasks', task);
        onAdd(data);
      }
      setTask({ title: '', description: '', dueDate: '', status: 'pending' });
    } catch (err) {
      alert("Error saving task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Title */}
      <input
        name="title"
        placeholder="Title"
        required
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      
      {/* Description */}
      <textarea
        name="description"
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
        className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      
      {/* Due Date */}
      <input
        name="dueDate"
        type="date"
        required
        value={task.dueDate}
        onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
        className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {/* Status Selection Dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-500 ml-1 font-medium">Task Status</label>
        <select
          name="status"
          value={task.status}
          onChange={(e) => setTask({ ...task, status: e.target.value })}
          className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <button 
        type="submit"
        className={`w-full py-2 rounded font-bold text-white transition-colors ${
          editingTask ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {editingTask ? 'Update Task' : 'Add Task'}
      </button>

      {editingTask && (
        <button 
          type="button"
          onClick={() => window.location.reload()} 
          className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors py-1"
        >
          Cancel Edit
        </button>
      )}
    </form>
  );
}