import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function TaskForm({ onAdd, onUpdate, editingTask }) {
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending',
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (editingTask) {
      setTask({
        title: editingTask.title,
        description: editingTask.description,
        dueDate: editingTask.dueDate
          ? editingTask.dueDate.split('T')[0]
          : '',
        status: editingTask.status || 'pending',
      });
    } else {
      setTask({ title: '', description: '', dueDate: '', status: 'pending' });
      setImage(null);
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', task.title);
      formData.append('description', task.description);
      formData.append('dueDate', task.dueDate);
      formData.append('status', task.status);
      if (image) formData.append('image', image);

      if (editingTask) {
        await onUpdate(editingTask._id, formData);
      } else {
        const { data } = await api.post('/tasks', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onAdd(data);
      }

      setTask({ title: '', description: '', dueDate: '', status: 'pending' });
      setImage(null);
    } catch (err) {
      alert('Error saving task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      {/* Title */}
      <input
        placeholder="Title"
        required
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
        className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
      />

      {/* Due Date */}
      <input
        type="date"
        required
        value={task.dueDate}
        onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
        className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
      />

      {/* Status */}
      <select
        value={task.status}
        onChange={(e) => setTask({ ...task, status: e.target.value })}
        className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full text-sm text-slate-400"
      />

      {/* Submit */}
      <button
        type="submit"
        className={`w-full py-2 rounded font-bold text-white ${
          editingTask
            ? 'bg-amber-600 hover:bg-amber-500'
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {editingTask ? 'Update Task' : 'Add Task'}
      </button>

      {editingTask && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full text-xs text-slate-500 hover:text-slate-300"
        >
          Cancel Edit
        </button>
      )}
    </form>
  );
}
