const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Your Stripe secret key
const router = express.Router();

// Handle payment intent creation
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
