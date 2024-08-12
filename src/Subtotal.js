import React from 'react';
import './Subtotal.css';

function Subtotal({ basket }) {
  const calculateSubtotal = () => {
    return basket.reduce((amount, item) => amount + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className='subtotal'>
      <div className='checkout__summaryItem'>
        <span>Subtotal ({basket.reduce((count, item) => count + item.quantity, 0)} items):</span>
        <span>${calculateSubtotal()}</span>
      </div>
    </div>
  );
}

export default Subtotal;
