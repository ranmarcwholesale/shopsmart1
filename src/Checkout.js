import React, { useState, useEffect } from 'react';
import './Checkout.css';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ basket, setBasket = () => {} }) => {
  const navigate = useNavigate();
  const [basketState, setBasketState] = useState(basket);

  useEffect(() => {
    setBasketState(basket);
    console.log('Updated basket state:', basket);
  }, [basket]);

  const calculateSubtotal = () => {
    return basketState
      .reduce((total, item) => {
        const itemTotal = item.price ? item.price * item.index.quantity : 0;
        return total + itemTotal;
      }, 0)
      .toFixed(2);
  };

  const handleProceedToCheckout = () => {
    console.log('Proceeding to checkout with basket:', basketState);
    navigate('/customer-details', { state: { basket: basketState } });
  };

  const handleEmptyCart = () => {
    setBasketState([]);
    setBasket([]);
    console.log('Cart emptied');
  };

  const incrementQuantity = (item) => {
    const updatedBasket = basketState.map((basketItem) =>
      basketItem === item
        ? { ...basketItem, index: { ...basketItem.index, quantity: basketItem.index.quantity + 1 } }
        : basketItem
    );
    setBasketState(updatedBasket);
    setBasket(updatedBasket);
    console.log('Incremented quantity:', updatedBasket);
  };

  const decrementQuantity = (item) => {
    if (item.index.quantity > 1) {
      const updatedBasket = basketState.map((basketItem) =>
        basketItem === item
          ? { ...basketItem, index: { ...basketItem.index, quantity: basketItem.index.quantity - 1 } }
          : basketItem
      );
      setBasketState(updatedBasket);
      setBasket(updatedBasket);
      console.log('Decremented quantity:', updatedBasket);
    }
  };

  return (
    <div className="checkout">
      <div className="checkout__left">
        <h1 className="checkout__title">Your Wholesale Cart</h1>
        {basketState.length > 0 ? (
          <div className="checkout__products">
            {basketState.map((item, index) => (
              <div
                key={`${item.index.brand || 'Unknown'}-${item.index.puffs || '0'}-${item.index.flavor || 'Unknown'}-${index}`}
                className="checkout__productCard"
              >
                <img
                  src={item.index.image || '/images/placeholder.png'}
                  alt={item.index.brand || 'No brand available'}
                  className="checkout__productImage"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder.png';
                  }}
                />
                <div className="checkout__productInfo">
                  <h2 className="checkout__productBrand">{item.index.brand || 'No brand available'}</h2>
                  <p className="checkout__productFlavor">Flavor: {item.index.flavor || 'N/A'}</p>
                  <p className="checkout__productPuffs">Puffs: {item.index.puffs || 'N/A'}</p>
                  {item.price && (
                    <p className="checkout__productPrice">
                      Price: ${item.price.toFixed(2)}
                    </p>
                  )}
                  <div className="checkout__quantityControls">
                    <button
                      className="quantityControl__btn decrement"
                      onClick={() => decrementQuantity(item)}
                      disabled={item.index.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantityControl__quantity">
                      {item.index.quantity}
                    </span>
                    <button
                      className="quantityControl__btn increment"
                      onClick={() => incrementQuantity(item)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Your basket is currently empty.</p>
        )}
        {basketState.length > 0 && (
          <button onClick={handleEmptyCart} className="empty-cart-btn">
            Empty Cart
          </button>
        )}
      </div>

      <div className="checkout__right">
        <div className="checkout__summary">
          <h2>Order Summary</h2>
          {basketState.some(item => item.price) && (
            <p>Subtotal: ${calculateSubtotal()}</p>
          )}
          <button onClick={handleProceedToCheckout} className="proceed-btn">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
