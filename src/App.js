import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Checkout from './Checkout';
import Login from './Login';
import Register from './Register';
import Payment from './Payment'; // Import the Payment component
import StripePayment from './StripePayment'; // Import the new StripePayment component
import SidePanel from './SidePanel';
import './App.css';

function App() {
  const [basket, setBasket] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [user, setUser] = useState(null); // Add user state

  const handleAddToBasket = (product) => {
    setBasket((prevBasket) => {
      const index = prevBasket.findIndex((item) => item.id === product.id);
      if (index >= 0) {
        const updatedBasket = prevBasket.map((item, idx) =>
          idx === index ? { ...item, quantity: item.quantity + 1 } : item
        );
        return updatedBasket;
      } else {
        return [...prevBasket, { ...product, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromBasket = (product) => {
    setBasket((prevBasket) => {
      const index = prevBasket.findIndex((item) => item.id === product.id);
      if (index >= 0) {
        const updatedBasket = prevBasket
          .map((item, idx) =>
            idx === index ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0);
        return updatedBasket;
      }
      return prevBasket;
    });
  };

  const handleMenuClick = () => {
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path='/login'
            element={<Login setUser={setUser} />} // Pass setUser function to Login
          />
          <Route
            path='/checkout'
            element={
              <>
                <Header
                  basketCount={basket.reduce((count, item) => count + item.quantity, 0)}
                  onMenuClick={handleMenuClick}
                  user={user} // Pass user state to Header
                />
                {isPanelOpen && (
                  <div className="overlay" onClick={handleClosePanel}>
                    <SidePanel onClose={handleClosePanel} />
                  </div>
                )}
                <Checkout
                  basket={basket}
                  onAddToBasket={handleAddToBasket}
                  onRemoveFromBasket={handleRemoveFromBasket}
                  user={user} // Pass user state to Checkout
                />
              </>
            }
          />
          <Route
            path='/register'
            element={<Register />}
          />
          <Route
            path='/payment'
            element={<Payment user={user} basket={basket} />} // Add the payment route
          />
          <Route
            path='/stripe-payment'
            element={<StripePayment />} // Add the StripePayment route
          />
          <Route
            path='/'
            element={
              <>
                <Header
                  basketCount={basket.reduce((count, item) => count + item.quantity, 0)}
                  onMenuClick={handleMenuClick}
                  user={user} // Pass user state to Header
                />
                {isPanelOpen && (
                  <div className="overlay" onClick={handleClosePanel}>
                    <SidePanel onClose={handleClosePanel} />
                  </div>
                )}
                <Home
                  onAddToBasket={handleAddToBasket}
                  onRemoveFromBasket={handleRemoveFromBasket}
                  basket={basket}
                />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
