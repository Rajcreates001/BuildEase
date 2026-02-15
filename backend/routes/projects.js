const express = require('express');
const router = express.Router();
const { auth, contractorOnly, customerOnly } = require('../middleware/auth');
const {
  getProjects,
  getMyProjects,
  getProject,
  createProject,
  submitBid,
  updateProgress,
} = require('../controllers/projectController');

router.get('/', auth, getProjects);
router.get('/my', auth, getMyProjects);
router.get('/:id', auth, getProject);
router.post('/', auth, customerOnly, createProject);
router.post('/:id/bid', auth, contractorOnly, submitBid);
router.put('/:id/progress', auth, contractorOnly, updateProgress);

module.exports = router;
