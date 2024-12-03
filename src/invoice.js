// Invoice.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerInfo, basket } = location.state || {};
  const [invoiceUrl, setInvoiceUrl] = useState('');

  useEffect(() => {
    if (!customerInfo || !basket || !Array.isArray(basket)) {
      console.error('Invalid or missing data:', { customerInfo, basket });
      navigate('/customer-details');
    } else {
      const html = generateInvoiceHTML();
      sendDataToServer(customerInfo, basket, html);
    }
  }, [customerInfo, basket, navigate]);

  const generateInvoiceHTML = () => {
    const headers = `
      <tr>
        <th>Brand</th>
        <th>Type</th>
        <th>Flavor</th>
        <th>Puffs</th>
        <th>Quantity</th>
      </tr>`;

    const rows = basket
      .map(
        (item) => `
          <tr>
            <td>${item.brand || 'N/A'}</td>
            <td>${item.type || 'N/A'}</td>
            <td>${item.flavor || 'N/A'}</td>
            <td>${item.puffs || 'N/A'}</td>
            <td>${item.quantity || 'N/A'}</td>
          </tr>`
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1, h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Ranmarc Wholesale</h1>
        <h2>Invoice</h2>
        <p><strong>Customer Name:</strong> ${customerInfo.name}</p>
        <p><strong>Store Name:</strong> ${customerInfo.storeName}</p>
        <p><strong>Phone Number:</strong> ${customerInfo.phoneNumber}</p>
        <p><strong>Address:</strong> ${customerInfo.storeAddress}</p>
        <table>
          <thead>${headers}</thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
      </html>`;
  };

  const sendDataToServer = async (customerInfo, basket, invoiceHTML) => {
    try {
      const response = await fetch('http://localhost:5000/log-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerInfo, basket, invoiceHTML }),
      });

      if (!response.ok) throw new Error('Failed to log order');

      const data = await response.json();
      setInvoiceUrl(data.invoiceUrl); // Set the invoice URL for client viewing
    } catch (error) {
      console.error('Error logging order:', error);
      alert('Error sending data to server.');
    }
  };

  return (
    <div>
      <h1>Invoice Processing</h1>
      {invoiceUrl ? (
        <p>
          You can view your invoice here:{' '}
          <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
            {invoiceUrl}
          </a>
        </p>
      ) : (
        <p>Your invoice is being generated...</p>
      )}
    </div>
  );
};

export default Invoice;
