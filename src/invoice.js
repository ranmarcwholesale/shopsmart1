import React, { useEffect, useState } from 'react';
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
    }
  }, [customerInfo, basket, navigate]);

  const handleDownload = () => {
    const allKeys = [
      ...new Set(basket.flatMap((item) => Object.keys(item))).filter(
        (key) => key !== 'image'
      ),
    ];

    const headers = allKeys
      .map((key) => `<th>${key.charAt(0).toUpperCase() + key.slice(1)}</th>`)
      .join('');

    const itemsHTML = basket
      .map((item) => {
        const itemDetails = allKeys
          .map(
            (key) =>
              `<td>${item[key] !== undefined && item[key] !== null ? item[key] : 'N/A'}</td>`
          )
          .join('');
        return `<tr>${itemDetails}</tr>`;
      })
      .join('');

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .invoice-logo-container { text-align: center; margin-bottom: 20px; }
          .invoice-logo { max-width: 200px; height: auto; }
          h1, h2 { text-align: center; }
          h3 { margin-top: 40px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: middle; }
          th { background-color: #007BFF; color: white; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="invoice-logo-container">
          <img src="${logo}" alt="Ranmarc Wholesale Logo" class="invoice-logo" />
        </div>
        <h1>Ranmarc Wholesale</h1>
        <h2>Invoice</h2>
        <p><strong>Customer:</strong> ${customerInfo?.name || 'N/A'}</p>
        <p><strong>Store:</strong> ${customerInfo?.storeName || 'N/A'}</p>
        <p><strong>Phone:</strong> ${customerInfo?.phoneNumber || 'N/A'}</p>
        <p><strong>Address:</strong> ${customerInfo?.storeAddress || 'N/A'}</p>
        <hr />
        <h3>Order Details</h3>
        <table>
          <thead>
            <tr>${headers}</tr>
          </thead>
          <tbody>${itemsHTML}</tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Invoice.html';
    link.click();
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
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {[...new Set(basket.flatMap((item) => Object.keys(item)))]
                .filter((key) => key !== 'image')
                .map((key) => (
                  <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {basket.map((item, index) => (
              <tr key={index}>
                {[...new Set(basket.flatMap((item) => Object.keys(item)))]
                  .filter((key) => key !== 'image')
                  .map((key) => (
                    <td key={key}>
                      {item[key] !== undefined && item[key] !== null
                        ? item[key]
                        : 'N/A'}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleDownload} className="download-btn">
        Download Invoice
      </button>
    </div>
  );
};

export default Invoice;
