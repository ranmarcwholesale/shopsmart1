import React from 'react';
import './Subtotal.css';

function Subtotal({ basket }) {
  const calculateSubtotal = () => {
    return basket.reduce((amount, item) => amount + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className='subtotal'>
      <p>
        Subtotal ({basket.reduce((count, item) => count + item.quantity, 0)} items): <strong>${calculateSubtotal()}</strong>
      </p>
    </div>
  );
}

export default Subtotal;
