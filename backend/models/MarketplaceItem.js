const mongoose = require('mongoose');

const marketplaceItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Cement', 'Tiles', 'Paint', 'Steel', 'Plumbing', 'Electrical', 'Wood', 'Sand', 'Bricks'],
  },
  price: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  brand: {
    type: String,
    enum: ['indian', 'foreign'],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  inStock: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('MarketplaceItem', marketplaceItemSchema);
