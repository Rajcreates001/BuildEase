const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc    Get all open projects (for contractors to browse)
// @route   GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const projects = await Project.find(filter)
      .populate('customer', 'name email location')
      .populate('contractor', 'name companyName')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get projects for current user
// @route   GET /api/projects/my
exports.getMyProjects = async (req, res) => {
  try {
    const filter = req.user.role === 'customer'
      ? { customer: req.user._id }
      : { contractor: req.user._id };

    const projects = await Project.find(filter)
      .populate('customer', 'name email')
      .populate('contractor', 'name companyName')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('customer', 'name email location')
      .populate('contractor', 'name companyName email')
      .populate('bids.contractor', 'name companyName rating completedProjects');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const { title, description, budget, location, type, skills, totalBudget } = req.body;

    const project = await Project.create({
      title,
      description,
      budget,
      location,
      type,
      skills: skills || [],
      totalBudget: totalBudget || 0,
      customer: req.user._id,
      milestones: [
        { name: 'Foundation', status: 'upcoming' },
        { name: 'Structure & Slabs', status: 'upcoming' },
        { name: 'Roofing', status: 'upcoming' },
        { name: 'Plumbing & Electrical', status: 'upcoming' },
        { name: 'Finishing', status: 'upcoming' },
      ],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit a bid on a project
// @route   POST /api/projects/:id/bid
exports.submitBid = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { amount, timeline, message } = req.body;

    project.bids.push({
      contractor: req.user._id,
      amount,
      timeline,
      message,
    });

    await project.save();

    // Notify customer
    await Notification.create({
      user: project.customer,
      type: 'bid',
      text: `${req.user.companyName || req.user.name} placed a bid of ${amount} on your project "${project.title}".`,
    });

    res.json({ message: 'Bid submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update project progress
// @route   PUT /api/projects/:id/progress
exports.updateProgress = async (req, res) => {
  try {
    const { progress, nextMilestone, budgetSpent, update } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (progress !== undefined) project.progress = progress;
    if (nextMilestone) project.nextMilestone = nextMilestone;
    if (budgetSpent !== undefined) project.budgetSpent = budgetSpent;
    if (update) project.updates.push({ text: update, date: new Date() });

    await project.save();

    // Notify customer
    if (project.customer) {
      await Notification.create({
        user: project.customer,
        type: 'milestone',
        text: `Project "${project.title}" progress updated to ${progress}%.`,
      });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
