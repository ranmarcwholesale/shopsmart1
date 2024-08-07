// src/shopsmart-backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5 }, // Rating between 0 and 5
  quantityAvailable: { type: Number, required: true } // Quantity in stock
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
