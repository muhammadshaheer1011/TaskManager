const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    image: String, // ✅ Cloudinary URL
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
