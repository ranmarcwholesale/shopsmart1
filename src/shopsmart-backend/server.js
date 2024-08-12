require('dotenv').config(); // Load environment variables

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Ensure that STRIPE_SECRET_KEY is available
const stripe = require('stripe')('sk_test_51PmmeqAsZ3IOytfPOUqVkm8bjXZVP92A1B5E3LF8Jxez3zKSqouRabW8z5FtTcAtslcqm1Hm7MfJ3fzr9vu4d3D600e8JYwOnB'); // Import Stripe with your secret key

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
  name: { type: String, required: true },
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
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// Register Route
app.post('/api/register', async (req, res) => {
  const { name, email, phone, address, password } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCustomer = new Customer({
      name,
      email,
      phone,
      address,
      password: hashedPassword
    });

    await newCustomer.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
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
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Create Payment Intent Route
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(400).json({ msg: 'Payment creation error', error: err.message });
  }
});

// Confirm Payment Route
app.post('/api/confirm-payment', async (req, res) => {
  const { paymentMethodId, clientSecret } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.confirm(clientSecret, {
      payment_method: paymentMethodId,
    });

    if (paymentIntent.status === 'succeeded') {
      res.status(200).json({ success: true, paymentIntent });
    } else {
      res.status(400).json({ success: false, message: 'Payment not confirmed' });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
