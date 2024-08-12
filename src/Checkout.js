import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import Subtotal from './Subtotal';
import ad_2 from './Components/images/ad_2.webp';

const shippingFee = 5.99; // Example fixed shipping fee
const taxRate = 0.08; // Example tax rate of 8%

function Checkout({ basket, onAddToBasket, onRemoveFromBasket, user }) {
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return basket.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const subtotal = parseFloat(calculateSubtotal());
  const taxes = subtotal * taxRate;
  const estimatedTotal = subtotal + shippingFee + taxes;

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login'); // Redirect to login if not logged in
    } else {
      navigate('/payment'); // Redirect to payment if logged in
    }
  };

  return (
    <div className='checkout'>
      <div className='checkout__left'>
        <h1 className='checkout__title'>Your Shopping Cart</h1>
        <img className='checkout__ad' src={ad_2} alt='advertisement' />
        <div className='checkout__products'>
          {basket.map((item) => (
            <div key={item.id} className='checkout__product'>
              <img src={item.image} alt={item.title} />
              <div className='checkout__productInfo'>
                <p>{item.title}</p>
                <p className='checkout__productPrice'>
                  <small>$</small>
                  <strong>{item.price}</strong>
                </p>
                <div className='checkout__productRating'>
                  {Array(item.rating)
                    .fill()
                    .map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                </div>
                <div className='checkout__productControls'>
                  <button onClick={() => onRemoveFromBasket(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onAddToBasket(item)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='checkout__right'>
        <div className='checkout__summary'>
          <Subtotal basket={basket} />
          <div className='checkout__summaryItem'>
            <span>Shipping Fees:</span>
            <span>${shippingFee.toFixed(2)}</span>
          </div>
          <div className='checkout__summaryItem'>
            <span>Taxes:</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          <div className='checkout__summaryItem'>
            <span>Estimated Total:</span>
            <span>${estimatedTotal.toFixed(2)}</span>
          </div>
        </div>
        <button className='proceed-btn' onClick={handleProceedToCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Checkout;
