// Import React and other necessary libraries
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Checkout from './Checkout';
import CustomerDetails from './CustomerDetails';
import Invoice from './invoice'; // Ensure this path is correct

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9d3BrosC6bssgCuzrf-XzDv3JuefiIlY",
  authDomain: "ranmarcwholesale-62352.firebaseapp.com",
  projectId: "ranmarcwholesale-62352",
  storageBucket: "ranmarcwholesale-62352.firebasestorage.app",
  messagingSenderId: "1017896340436",
  appId: "1:1017896340436:web:3fdc02743d1441867c6441",
  measurementId: "G-LVGNDRRENK"
};

// Initialize Firebase and Analytics
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  const [basket, setBasket] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null); // Store customer information

  // Functions to handle adding and removing items in the basket
  const handleAddToBasket = (index, puffCount, flavor, quantity) => {
    const existingProduct = basket.find(item => item.index === index && item.puffCount === puffCount && item.flavor === flavor);

    if (existingProduct) {
      // Increment quantity
      setBasket(basket.map(item =>
        item.index === index && item.puffCount === puffCount && item.flavor === flavor
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      // Add new product to basket
      setBasket([...basket, { index, puffCount, flavor, quantity }]);
    }
  };

  const handleRemoveFromBasket = (index, puffCount, flavor, quantity) => {
    const existingProduct = basket.find(item => item.index === index && item.puffCount === puffCount && item.flavor === flavor);

    if (existingProduct) {
      if (existingProduct.quantity > quantity) {
        // Decrement quantity
        setBasket(basket.map(item =>
          item.index === index && item.puffCount === puffCount && item.flavor === flavor
            ? { ...item, quantity: item.quantity - quantity }
            : item
        ));
      } else {
        // Remove product if quantity reaches 0
        setBasket(basket.filter(item => !(item.index === index && item.puffCount === puffCount && item.flavor === flavor)));
      }
    }
  };

  return (
    <Router>
      <Header basketCount={basket.length} />
      <Routes>
        <Route path="/" element={<Home onAddToBasket={handleAddToBasket} />} />
        
        <Route
          path="/checkout"
          element={<Checkout basket={basket} onAddToBasket={handleAddToBasket} onRemoveFromBasket={handleRemoveFromBasket} />}
        />
        
        <Route
          path="/customer-details"
          element={<CustomerDetails basket={basket} setCustomerInfo={setCustomerInfo} />}
        />
        
        <Route
          path="/invoice"
          element={<Invoice basket={basket} customerInfo={customerInfo} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
