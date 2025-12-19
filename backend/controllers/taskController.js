const Task = require('../models/Task');
const cloudinary = require('../config/cloudinary');

/* GET all tasks for logged-in user */
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CREATE new task */
exports.createTask = async (req, res) => {
  try {
    let imageUrl = '';

    // If image uploaded
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: 'task-manager',
      });
      imageUrl = upload.secure_url;
    }

    const task = await Task.create({
      ...req.body,
      image: imageUrl,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* UPDATE task (EDIT) */
exports.updateTask = async (req, res) => {
  try {
    let updatedData = req.body;

    // If new image uploaded
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: 'task-manager',
      });
      updatedData.image = upload.secure_url;
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // 🔒 ownership check
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* DELETE task */
exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
