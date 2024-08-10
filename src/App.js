
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Checkout from './Checkout';
import Login from './Login';
import Register from './Register';
import SidePanel from './SidePanel';
import './App.css';

function App() {
  const [basket, setBasket] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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
            element={<Login />}
          />
          <Route
            path='/checkout'
            element={
              <>
                <Header basketCount={basket.reduce((count, item) => count + item.quantity, 0)} onMenuClick={handleMenuClick} />
                {isPanelOpen && (
                  <div className="overlay" onClick={handleClosePanel}>
                    <SidePanel onClose={handleClosePanel} />
                  </div>
                )}
                <Checkout
                  basket={basket}
                  onAddToBasket={handleAddToBasket}
                  onRemoveFromBasket={handleRemoveFromBasket}
                />
              </>
            }
          />
          <Route
            path='/Register'
            element={<Register/>}
          />
          <Route
            path='/'
            element={
              <>
                <Header basketCount={basket.reduce((count, item) => count + item.quantity, 0)} onMenuClick={handleMenuClick} />
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
