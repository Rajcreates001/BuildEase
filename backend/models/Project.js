const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  budget: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['New Construction', 'Renovation', 'Commercial', 'Interiors'],
    default: 'New Construction',
  },
  skills: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open',
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  totalBudget: {
    type: Number,
    default: 0,
  },
  budgetSpent: {
    type: Number,
    default: 0,
  },
  nextMilestone: {
    type: String,
    default: '',
  },
  milestones: [{
    name: { type: String },
    status: { type: String, enum: ['completed', 'in-progress', 'upcoming'], default: 'upcoming' },
    date: { type: Date },
  }],
  updates: [{
    text: { type: String },
    date: { type: Date, default: Date.now },
  }],
  gallery: [{
    type: String,
  }],
  bids: [{
    contractor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: String },
    timeline: { type: String },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
