const User = require('../models/User');

// @desc    Get all contractors
// @route   GET /api/contractors
exports.getContractors = async (req, res) => {
  try {
    const { specialization } = req.query;
    const filter = { role: 'contractor' };
    if (specialization && specialization !== 'All') {
      filter.specialization = specialization;
    }

    const contractors = await User.find(filter)
      .select('-password')
      .sort({ rating: -1 });

    res.json(contractors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single contractor profile
// @route   GET /api/contractors/:id
exports.getContractor = async (req, res) => {
  try {
    const contractor = await User.findById(req.params.id).select('-password');
    if (!contractor || contractor.role !== 'contractor') {
      return res.status(404).json({ message: 'Contractor not found' });
    }
    res.json(contractor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
