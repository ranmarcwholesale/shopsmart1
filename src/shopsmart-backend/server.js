const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

// Define Customer Schema and Model
const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true }
});

const Customer = mongoose.model('Customer', customerSchema);

// Define Product Schema and Model
const productSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number,
  rating: Number,
  quantity: Number
});

const Product = mongoose.model('Product', productSchema);

// Products Route
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register Route
app.post('/api/register', async (req, res) => {
  const { email, phone, address, password } = req.body;
  
  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) return res.status(400).json({ msg: 'User already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCustomer = new Customer({
      email,
      phone,
      address,
      password: hashedPassword
    });

    await newCustomer.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err); // Added error logging
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      customer: {
        id: customer._id,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      }
    });
  } catch (err) {
    console.error('Login error:', err); // Added error logging
    res.status(500).json({ msg: 'Server error' });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
