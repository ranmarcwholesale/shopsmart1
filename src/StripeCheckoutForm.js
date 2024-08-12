import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51PmmeqAsZ3IOytfPLdzPPSAkGAXTbpCubwtOAZbTLnu4zkSTUrwI6tJRTJcU6sOUDi5PsInYSjLAs0cQgnnBGwRb005IqM3PQP'); // Replace with your public key

function StripeCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (stripeError) {
      setError(stripeError.message);
      return;
    }

    try {
      const { data } = await axios.post('/api/payment', {
        amount: 5000, // Amount in cents, e.g., $50.00
        paymentMethodId: paymentMethod.id,
      });

      if (data.success) {
        setSuccess('Payment successful!');
      } else {
        setError('Payment failed: ' + data.message);
      }
    } catch (error) {
      setError('Payment error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay</button>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
    </form>
  );
}

function StripePayment() {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm />
    </Elements>
  );
}

export default StripePayment;
