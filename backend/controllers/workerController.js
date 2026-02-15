const Worker = require('../models/Worker');

// @desc    Get workers for a contractor
// @route   GET /api/workers
exports.getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({ contractor: req.user._id })
      .populate('assignedProject', 'title')
      .sort({ name: 1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a worker
// @route   POST /api/workers
exports.addWorker = async (req, res) => {
  try {
    const { name, role, phone, dailyWage } = req.body;

    const worker = await Worker.create({
      name,
      role,
      phone,
      dailyWage,
      contractor: req.user._id,
    });

    res.status(201).json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update worker status
// @route   PUT /api/workers/:id
exports.updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findOne({ _id: req.params.id, contractor: req.user._id });
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    const { status, assignedProject, name, role } = req.body;
    if (status) worker.status = status;
    if (assignedProject !== undefined) worker.assignedProject = assignedProject;
    if (name) worker.name = name;
    if (role) worker.role = role;

    await worker.save();
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a worker
// @route   DELETE /api/workers/:id
exports.deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findOneAndDelete({ _id: req.params.id, contractor: req.user._id });
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json({ message: 'Worker removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
