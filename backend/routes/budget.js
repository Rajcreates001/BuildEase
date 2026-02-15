const express = require('express');
const router = express.Router();
const { calculateEstimate, calculateQuotation, calculatePrediction, getMarketRates } = require('../controllers/budgetController');

router.post('/estimate', calculateEstimate);
router.post('/quotation', calculateQuotation);
router.post('/prediction', calculatePrediction);
router.get('/rates', getMarketRates);

module.exports = router;
