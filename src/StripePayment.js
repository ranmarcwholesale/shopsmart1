import React from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './StripePayment.css'; // Import the CSS for styling
import logo from './Components/images/Logo.png';
import { Link } from 'react-router-dom';
// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_51PmmeqAsZ3IOytfPLdzPPSAkGAXTbpCubwtOAZbTLnu4zkSTUrwI6tJRTJcU6sOUDi5PsInYSjLAs0cQgnnBGwRb005IqM3PQP');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe.js has not yet loaded.');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found.');
      return;
    }

    // Create payment method
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (paymentMethodError) {
      setError(paymentMethodError.message);
      return;
    }

    // Call backend to create payment intent
    
    const response = await fetch('http://localhost:5000/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 1000 }) // Amount in cents
    });

    if (!response.ok) {
      setError('Failed to create payment intent.');
      return;
    }

    const { clientSecret } = await response.json();

    // Confirm payment
    const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      setError(confirmError.message);
      return;
    }

    setSuccess('Payment successful!');
  };

  return (
    <div>
    <Link to='/'>
    <img className='StripePayment__logo' src={logo} alt='logo'/>
    </Link>
    <form onSubmit={handleSubmit} className="payment-form">
      <h2>Enter Payment Details</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <label>
        Card details
        <CardElement className="card-element" />
      </label>
      <button type="submit" className="submit-button" disabled={!stripe}>Pay</button>
    </form>
    </div>
  );
};

function StripePayment() {
  return (
    <div className="stripe-payment">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default StripePayment;
