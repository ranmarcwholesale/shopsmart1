// src/shopsmart-backend/seed.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const products = [
  {
    name: 'Product 1',
    price: 10.99,
    category: 'Category 1',
    imageUrl: 'https://via.placeholder.com/150?text=Product+1',
    rating: 4.5, // Example rating
    quantityAvailable: 100 // Example quantity
  },
  {
    name: 'Product 2',
    price: 20.99,
    category: 'Category 2',
    imageUrl: 'https://via.placeholder.com/150?text=Product+2',
    rating: 3.8,
    quantityAvailable: 50
  },
  {
    name: 'Product 3',
    price: 30.99,
    category: 'Category 3',
    imageUrl: 'https://via.placeholder.com/150?text=Product+3',
    rating: 4.2,
    quantityAvailable: 200
  }
];

Product.insertMany(products)
  .then(() => {
    console.log('Products seeded');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error seeding products:', err);
  });
