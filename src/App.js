// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Checkout from './Checkout';
import CustomerDetails from './CustomerDetails';
import Invoice from './invoice'; // Ensure this path is correct

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: 'AIzaSyC9d3BrosC6bssgCuzrf-XzDv3JuefiIlY',
  authDomain: 'ranmarcwholesale-62352.firebaseapp.com',
  projectId: 'ranmarcwholesale-62352',
  storageBucket: 'ranmarcwholesale-62352.firebasestorage.app',
  messagingSenderId: '1017896340436',
  appId: '1:1017896340436:web:3fdc02743d1441867c6441',
  measurementId: 'G-LVGNDRRENK',
};

// Initialize Firebase and Analytics
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  const [basket, setBasket] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null); // Store customer information
  const [searchQuery, setSearchQuery] = useState(''); // Search functionality state

  // Functions to handle adding and removing items in the basket
  const handleAddToBasket = (basketItem) => {
    const existingProductIndex = basket.findIndex(
      (item) =>
        item.brand === basketItem.brand &&
        item.flavor === basketItem.flavor &&
        item.puffs === basketItem.puffs &&
        item.type === basketItem.type
    );

    if (existingProductIndex !== -1) {
      // Increment quantity
      const updatedBasket = [...basket];
      updatedBasket[existingProductIndex].quantity += basketItem.quantity;
      setBasket(updatedBasket);
    } else {
      // Add new product to basket
      setBasket([...basket, basketItem]);
    }
  };

  const handleRemoveFromBasket = (basketItem) => {
    const updatedBasket = basket.filter(
      (item) =>
        !(
          item.brand === basketItem.brand &&
          item.flavor === basketItem.flavor &&
          item.puffs === basketItem.puffs &&
          item.type === basketItem.type
        )
    );
    setBasket(updatedBasket);
  };

  return (
    <Router>
      <Header
        basketCount={basket.length}
        onSearch={(query) => setSearchQuery(query)}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              onAddToBasket={handleAddToBasket}
              searchQuery={searchQuery}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <Checkout
              basket={basket}
              setBasket={setBasket} // Pass setBasket to Checkout component
              onAddToBasket={handleAddToBasket}
              onRemoveFromBasket={handleRemoveFromBasket}
            />
          }
        />

        <Route
          path="/customer-details"
          element={
            <CustomerDetails
              basket={basket}
              setCustomerInfo={setCustomerInfo}
            />
          }
        />

        <Route
          path="/invoice"
          element={
            <Invoice
              basket={basket}
              customerInfo={customerInfo}
              setBasket={setBasket} // Pass setBasket to Invoice component
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
