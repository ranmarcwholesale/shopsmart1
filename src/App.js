import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Checkout from './Checkout';
import CustomerDetails from './CustomerDetails'; // Import the CustomerDetails page
import Invoice from './invoice'; // Ensure this path is correct

function App() {
  const [basket, setBasket] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null); // Store customer information

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
