const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['customer', 'contractor'],
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  // Contractor-specific fields
  companyName: {
    type: String,
    default: '',
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
  specialization: {
    type: String,
    enum: ['Residential Construction', 'Commercial Projects', 'Renovations & Remodeling', 'Luxury Villas', 'Budget Homes', ''],
    default: '',
  },
  companyWebsite: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  completedProjects: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
