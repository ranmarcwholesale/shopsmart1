// CustomerDetails.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CustomerDetails.css';

const CustomerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { basket } = location.state || {};

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    storeName: '',
    phoneNumber: '',
    storeAddress: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!basket) {
      navigate('/checkout');
    }
  }, [basket, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    });
  };

  const handleContinue = () => {
    if (
      !customerInfo.name ||
      !customerInfo.storeName ||
      !customerInfo.phoneNumber ||
      !customerInfo.storeAddress
    ) {
      setErrorMessage('Please fill in all the fields.');
      return;
    }

    navigate('/invoice', { state: { customerInfo, basket } });
  };

  return (
    <div className="customer-details">
      <h1>Customer Information</h1>
      <div className="customer-details__form">
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={customerInfo.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="storeName"
          placeholder="Store Name"
          value={customerInfo.storeName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={customerInfo.phoneNumber}
          onChange={handleChange}
          required
        />
        <textarea
          name="storeAddress"
          placeholder="Store Address"
          value={customerInfo.storeAddress}
          onChange={handleChange}
          required
        />
        <button className="continue-btn" onClick={handleContinue}>
          Continue to Invoice
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default CustomerDetails;

