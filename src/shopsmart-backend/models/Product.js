// src/shopsmart-backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  quantityAvailable: { type: Number, required: true },
  category: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
