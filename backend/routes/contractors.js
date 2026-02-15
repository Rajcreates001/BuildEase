const express = require('express');
const router = express.Router();
const { getContractors, getContractor } = require('../controllers/contractorController');

router.get('/', getContractors);
router.get('/:id', getContractor);

module.exports = router;
