import React from 'react';
import './Checkout.css';
import Subtotal from './Subtotal';
import ad_2 from './Components/images/ad_2.webp'; 


function Checkout({ basket, onAddToBasket, onRemoveFromBasket }) {
  return (
    <div className='checkout'>
      <div className='checkout__left'>
        <img className='checkout__ad' src={ad_2} alt='advertisement' />
        <div>
          <h1 className='checkout__title'>Your Shopping Cart</h1>
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
        <Subtotal basket={basket} />
      </div>
    </div>
  );
}

export default Checkout;
