require('dotenv').config(); // Load environment variables

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Import Axios

// Ensure that STRIPE_SECRET_KEY is available
const stripe = require('stripe')('sk_test_51PmmeqAsZ3IOytfPOUqVkm8bjXZVP92A1B5E3LF8Jxez3zKSqouRabW8z5FtTcAtslcqm1Hm7MfJ3fzr9vu4d3D600e8JYwOnB'); // Use your Stripe secret key from the environment variables

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
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  quantity: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  stock: { type: Number, default: 0 },
});

const Product = mongoose.model('Product', productSchema);

// Products Route (Local MongoDB)
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});


const product2Schema = new mongoose.Schema({
  ProductName: { type: String, required: true },
  Price: { type: String, required: true },
  StarRating: { type: String, required: true },
  ImageURL: { type: String, required: true }
});

const Product2 = mongoose.model('Product2', product2Schema);

// Route to get products from MongoDB
// Server code (server.js or app.js)
// Ensure this route is set up in your server file
app.get('/api/products2', async (req, res) => {
  try {
    const products = await mongoose.connection.db.collection('products2').find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});




// Open Food Facts API Route
app.get('/api/openfoodfacts', async (req, res) => {
  const { code, search } = req.query; // Get product barcode or search term from query parameters

  try {
    if (code) {
      // Fetch product details by barcode
      const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const product = response.data.product;

      if (product) {
        res.json({
          title: product.product_name || 'No Title',
          image: product.image_url || '',
          price: product.price || 0,
          rating: product.nutrition_grades_tags ? product.nutrition_grades_tags.join(', ') : 'No Rating',
          description: product.ingredients_text || '',
          category: product.categories_tags ? product.categories_tags.join(', ') : '',
          stock: product.quantity ? 10 : 0 // Example stock
        });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } else if (search) {
      // Search for products by name
      const response = await axios.get(`https://world.openfoodfacts.org/api/v0/products.json`, {
        params: { search_terms: search }
      });

      const products = response.data.products.map(product => ({
        title: product.product_name || 'No Title',
        image: product.image_url || '',
        price: product.price || 0,
        rating: product.nutrition_grades_tags ? product.nutrition_grades_tags.join(', ') : 'No Rating',
        description: product.ingredients_text || '',
        category: product.categories_tags ? product.categories_tags.join(', ') : '',
        stock: product.quantity ? 10 : 0 // Example stock
      }));

      res.json(products);
    } else {
      res.status(400).json({ message: 'Either product code or search term is required' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products from Open Food Facts', error: err.message });
  }
});

// Spoonacular API Route
app.get('/api/spoonacular', async (req, res) => {
  try {
    const response = await axios.get(`https://api.spoonacular.com/food/products/search`, {
      params: {
        query: req.query.query || 'grocery',
        number: 10,
        apiKey: '4c8fa578fe0e4901a0461ce74a44de62' // Replace with your actual API key
      }
    });

    const products = response.data.products.map(product => ({
      title: product.title || 'No Title',
      image: product.image || '', // Use a default image or empty string if not available
      price: product.price || 0,
      rating: product.rating || 0,
      quantity: (product.servings && product.servings.size) ? product.servings.size : 1, // Default to 1 if size is not provided
      description: product.description || '',
      category: product.category || '',
      stock: product.in_stock ? 10 : 0 // Set default stock
    }));

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products from Spoonacular', error: err.message });
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
