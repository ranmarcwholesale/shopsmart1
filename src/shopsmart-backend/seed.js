// Seed.js:
//A separate script for populating the database with initial product data.
//Connects to MongoDB, clears existing data, inserts new data, and then disconnects.
//Execution:
//Run manually using Node.js to populate the database.
require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Adjust path as needed

const uri = process.env.MONGODB_URI; // Retrieve MongoDB URI from environment variables

if (!uri) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    return Product.deleteMany({}); // Clear existing data
  })
  .then(() => {
    // Define dummy data with required fields
    const products = [
      {
        name: 'Bananas',
        imageUrl: 'product1.jpg', // Use relative path
        price: 1.99,
        rating: 5,
        quantityAvailable: 10,
        category: 'Fruits'
      },
      {
        name: 'Apples',
        imageUrl: 'product2.webp', // Use relative path
        price: 2.99,
        rating: 4,
        quantityAvailable: 20,
        category: 'Fruits'
      },
      {
        name: 'Oranges',
        imageUrl: 'product3.webp', // Use relative path
        price: 3.99,
        rating: 4,
        quantityAvailable: 15,
        category: 'Fruits'
      },
      {
        name: 'Watermelon',
        imageUrl: 'product4.webp', // Use relative path
        price: 7.99,
        rating: 3,
        quantityAvailable: 5,
        category: 'Fruits'
      }
    ];

    // Insert dummy data into the database
    return Product.insertMany(products);
  })
  .then(() => {
    console.log('Dummy data inserted');
    mongoose.disconnect(); // Close connection
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect(); // Close connection on error
  });
