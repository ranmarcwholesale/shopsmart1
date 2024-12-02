// Invoice.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Invoice.css';
import logo from './Components/images/Logo.png';

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { customerInfo, basket } = location.state || {};

  useEffect(() => {
    if (!customerInfo || !basket) {
      navigate('/customer-details');
      return;
    }

    const invoiceHTML = generateInvoiceHTML();
    /*
    const sendDataToServer = async () => {
      try {
        const response = await fetch('http://localhost:5000/log-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerInfo, basket, invoiceHTML }),
        });

        if (!response.ok) {
          throw new Error('Failed to log order');
        }

        await response.text();
      } catch (error) {
        console.error('Error sending data to server:', error);
        alert('There was an error processing your order.');
      }
    };

    sendDataToServer();
  }, [customerInfo, basket, navigate]);
 */
  const generateInvoiceHTML = () => {
    const itemsHTML = basket
      .map(
        (item) => `
          <tr>
            <td>${item.index.brand || ''}</td>
            <td>${item.index.flavor || ''}</td>
            <td>${item.index.puffs || ''}</td>
            <td>${item.index.quantity || ''}</td>
          </tr>
        `
      )
      .join('');

    const logoBase64 = getBase64Logo();

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .invoice-logo-container {
            text-align: center;
            margin-bottom: 20px;
          }
          .invoice-logo {
            max-width: 200px;
            height: auto;
          }
          h1, h2 {
            text-align: center;
          }
          h3 {
            margin-top: 40px;
          }
          p {
            font-size: 16px;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #dddddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <div class="invoice-logo-container">
          <img src="${logoBase64}" alt="Ranmarc Wholesale Logo" class="invoice-logo" />
        </div>
        <h1>Ranmarc Wholesale</h1>
        <h2>Invoice</h2>
        <p><strong>Customer:</strong> ${customerInfo.name || 'N/A'}</p>
        <p><strong>Store:</strong> ${customerInfo.storeName || 'N/A'}</p>
        <p><strong>Phone:</strong> ${customerInfo.phoneNumber || 'N/A'}</p>
        <p><strong>Address:</strong> ${customerInfo.storeAddress || 'N/A'}</p>
        <hr />
        <h3>Order Details</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Flavor</th>
              <th>Puffs</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </body>
      </html>
    `;
    return invoiceHTML;
  };

  const getBase64Logo = () => {
    // Convert the logo image to Base64
    const logoBase64String = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...'; // Replace with your actual Base64 string
    return logoBase64String;
  };

  return (
    <div className="invoice">
      <div className="invoice-logo-container">
        <img src={logo} alt="Ranmarc Wholesale Logo" className="invoice-logo" />
      </div>
      <h1>Ranmarc Wholesale</h1>
      <h2>Invoice</h2>
      <p>
        <strong>Customer:</strong> {customerInfo?.name || 'N/A'}
      </p>
      <p>
        <strong>Store:</strong> {customerInfo?.storeName || 'N/A'}
      </p>
      <p>
        <strong>Phone:</strong> {customerInfo?.phoneNumber || 'N/A'}
      </p>
      <p>
        <strong>Address:</strong> {customerInfo?.storeAddress || 'N/A'}
      </p>
      <hr />
      <h3>Order Details</h3>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Flavor</th>
            <th>Puffs</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {basket.map((item, index) => (
            <tr key={index}>
              <td>{item.index.brand || ''}</td>
              <td>{item.index.flavor || ''}</td>
              <td>{item.index.puffs || ''}</td>
              <td>{item.index.quantity || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoice;
