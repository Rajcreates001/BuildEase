const express = require('express');
const router = express.Router();
const { auth, contractorOnly } = require('../middleware/auth');
const { getWorkers, addWorker, updateWorker, deleteWorker } = require('../controllers/workerController');

router.get('/', auth, contractorOnly, getWorkers);
router.post('/', auth, contractorOnly, addWorker);
router.put('/:id', auth, contractorOnly, updateWorker);
router.delete('/:id', auth, contractorOnly, deleteWorker);

module.exports = router;
