const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Mason', 'Plumber', 'Electrician', 'Carpenter', 'Painter', 'Laborer', 'Supervisor'],
  },
  status: {
    type: String,
    enum: ['Available', 'Assigned', 'On Leave'],
    default: 'Available',
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null,
  },
  phone: {
    type: String,
    default: '',
  },
  dailyWage: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Worker', workerSchema);
