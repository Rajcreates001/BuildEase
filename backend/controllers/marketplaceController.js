const MarketplaceItem = require('../models/MarketplaceItem');
const Order = require('../models/Order');

// @desc    Get all marketplace items
// @route   GET /api/marketplace
exports.getItems = async (req, res) => {
  try {
    const { brand, category } = req.query;
    const filter = {};
    if (brand) filter.brand = brand;
    if (category) filter.category = category;

    const items = await MarketplaceItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single item
// @route   GET /api/marketplace/:id
exports.getItem = async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create an order
// @route   POST /api/marketplace/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of items) {
      const item = await MarketplaceItem.findById(cartItem.itemId);
      if (!item) continue;
      totalAmount += item.price * cartItem.quantity;
      orderItems.push({
        item: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItem.quantity,
        unit: item.unit,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user orders
// @route   GET /api/marketplace/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.item')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
