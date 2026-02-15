const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: errors.array().map(e => e.msg).join(', '),
        errors: errors.array() 
      });
    }

    const { name, email, password, role, location, companyName, yearsOfExperience, specialization, companyWebsite } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const userData = { name, email, password, role };
    if (role === 'customer') {
      userData.location = location || '';
    } else if (role === 'contractor') {
      userData.companyName = companyName || '';
      userData.yearsOfExperience = yearsOfExperience || 0;
      userData.specialization = specialization || '';
      userData.companyWebsite = companyWebsite || '';
    }

    const user = await User.create(userData);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      companyName: user.companyName,
      specialization: user.specialization,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      companyName: user.companyName,
      specialization: user.specialization,
      yearsOfExperience: user.yearsOfExperience,
      companyWebsite: user.companyWebsite,
      rating: user.rating,
      completedProjects: user.completedProjects,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, location, companyName, companyWebsite, specialization, yearsOfExperience } = req.body;

    if (name) user.name = name;
    if (location) user.location = location;
    if (user.role === 'contractor') {
      if (companyName) user.companyName = companyName;
      if (companyWebsite) user.companyWebsite = companyWebsite;
      if (specialization) user.specialization = specialization;
      if (yearsOfExperience) user.yearsOfExperience = yearsOfExperience;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      location: updatedUser.location,
      companyName: updatedUser.companyName,
      specialization: updatedUser.specialization,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
