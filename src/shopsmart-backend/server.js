// src/shopsmart-backend/server.js

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (images)
app.use('/images', express.static(path.join(__dirname, '../Components/images')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Product Schema and Model
const productSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number,
  rating: Number,
  quantity: Number
});

const Product = mongoose.model('Product', productSchema);

// Define Routes
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    console.log(products); // Verify the structure of each product
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Start the Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
