const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getItems, getItem, createOrder, getOrders } = require('../controllers/marketplaceController');

router.get('/', getItems);
router.get('/item/:id', getItem);
router.post('/orders', auth, createOrder);
router.get('/orders', auth, getOrders);

module.exports = router;
