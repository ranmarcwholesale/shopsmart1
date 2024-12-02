// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Replace with your Google Sheet's published CSV URL
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS9yTFEyHsOfYjdzQtOriWq0s5EuxhYNrRyqxCYKeTROfW4tMvfPzB84q6f8V2C8Tt-Zmi90lcYKsCS/pub?output=csv';

// Endpoint to fetch data from Google Sheets (CSV format)
app.get('/data', async (req, res) => {
  try {
    const response = await axios.get(SHEET_CSV_URL, { responseType: 'stream' });
    const results = [];

    response.data
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        res.json(results);
      });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Failed to fetch data');
  }
});

// Endpoint to log orders and send email notifications
app.post('/log-order', async (req, res) => {
  const { customerInfo, basket, invoiceHTML } = req.body;

  const now = new Date();
  const dateTime = now.toLocaleString();

  let invoiceLink = '';
  const INVOICES_DIR = path.join(__dirname, 'invoices');
  if (!fs.existsSync(INVOICES_DIR)) {
    fs.mkdirSync(INVOICES_DIR);
  }

  if (invoiceHTML) {
    const invoiceFilename = `invoice_${now.getTime()}.html`;
    const invoiceFilePath = path.join(INVOICES_DIR, invoiceFilename);

    try {
      fs.writeFileSync(invoiceFilePath, invoiceHTML, 'utf8');
      invoiceLink = `http://localhost:${PORT}/invoices/${invoiceFilename}`;
    } catch (error) {
      console.error('Error saving invoice:', error);
      return res.status(500).send('Failed to save invoice.');
    }
  }

  const newOrder = {
    id: now.getTime(),
    dateTime,
    customerInfo,
    basket,
    invoiceLink,
    paymentReceived: false,
  };

  try {
    const ordersPath = path.join(__dirname, 'orders.json');
    let orders = [];
    if (fs.existsSync(ordersPath)) {
      const data = fs.readFileSync(ordersPath, 'utf8');
      orders = JSON.parse(data);
    }
    orders.push(newOrder);
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error saving order:', error);
    return res.status(500).send('Failed to log order.');
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ranmarcwholesale@gmail.com',
        pass: 'tqye sqdk wkwp eapq',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const wholesalerEmail = 'ranmarcwholesale@gmail.com';
    const productDetails = basket
      .map(item => `${item.brand} - ${item.flavor} (Puffs: ${item.puffs}, Quantity: ${item.quantity})`)
      .join('; ');

    const emailSubject = `New Order Received - Order ID ${newOrder.id}`;
    const emailBody = `
      <h3>New Order Received</h3>
      <p><strong>Order ID:</strong> ${newOrder.id}</p>
      <p><strong>Date Time:</strong> ${newOrder.dateTime}</p>
      <p><strong>Customer Name:</strong> ${customerInfo.name}</p>
      <p><strong>Store Name:</strong> ${customerInfo.storeName}</p>
      <p><strong>Phone Number:</strong> ${customerInfo.phoneNumber}</p>
      <p><strong>Store Address:</strong> ${customerInfo.storeAddress}</p>
      <p><strong>Products:</strong> ${productDetails}</p>
      ${invoiceLink ? `<p><strong>Invoice:</strong> <a href="${invoiceLink}">View Invoice</a></p>` : ''}
    `;

    const mailOptions = {
      from: 'ranmarcwholesale@gmail.com',
      to: wholesalerEmail,
      subject: emailSubject,
      html: emailBody,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Order logged and wholesaler notified successfully.');
  } catch (error) {
    console.error('Error sending email to wholesaler:', error);
    res.status(500).send('Failed to send order details to wholesaler.');
  }
});

// Serve invoices
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
