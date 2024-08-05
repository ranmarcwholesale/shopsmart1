import React, { useState } from 'react';
import Header from './Header';
import Home from './Home';
import Checkout from './Checkout';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [basket, setBasket] = useState([]);

  const handleAddToBasket = (product) => {
    setBasket((prevBasket) => {
      const index = prevBasket.findIndex((item) => item.id === product.id);
      if (index >= 0) {
        // If the item is already in the basket, increment its quantity
        const updatedBasket = prevBasket.map((item, idx) =>
          idx === index ? { ...item, quantity: item.quantity + 1 } : item
        );
        return updatedBasket;
      } else {
        // If the item is not in the basket, add it with quantity 1
        return [...prevBasket, { ...product, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromBasket = (product) => {
    setBasket((prevBasket) => {
      const index = prevBasket.findIndex((item) => item.id === product.id);
      if (index >= 0) {
        if (index >= 0) {
          // Decrement the quantity of the existing product
          const updatedBasket = prevBasket
            .map((item, idx) =>
              idx === index ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0); // Remove the item if quantity is 0
          return updatedBasket;
        }
        else {
          return prevBasket.filter((item) => item.id !== product.id);
        }
      }
      return prevBasket;
    });
  };

  return (
    <Router>
      <div className="App">
        <Header basketCount={basket.reduce((count, item) => count + item.quantity, 0)} />
        <Routes>
          <Route
            path='/checkout'
            element={
              <Checkout
                basket={basket}
                onAddToBasket={handleAddToBasket}
                onRemoveFromBasket={handleRemoveFromBasket}
              />
            }
          />
          <Route
            path='/'
            element={
              <Home
                onAddToBasket={handleAddToBasket}
                onRemoveFromBasket={handleRemoveFromBasket}
                basket={basket}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
