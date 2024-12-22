const express = require('express');
const cors = require('cors');
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const pdf = require('html-pdf'); // Library to generate PDFs
const { v4: uuidv4 } = require('uuid'); // Library for generating unique IDs
const crypto = require('crypto'); // Library for hashing

const app = express();

// Use CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Replace with your Google Sheet's published CSV URL
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS9yTFEyHsOfYjdzQtOriWq0s5EuxhYNrRyqxCYKeTROfW4tMvfPzB84q6f8V2C8Tt-Zmi90lcYKsCS/pub?output=csv';

// File paths
const ordersPath = path.join(__dirname, 'orders.json');
const INVOICES_DIR = path.join(__dirname, 'invoices');
if (!fs.existsSync(INVOICES_DIR)) {
  fs.mkdirSync(INVOICES_DIR);
}

// Utility to load orders from file
const loadOrders = () => {
  if (fs.existsSync(ordersPath)) {
    const data = fs.readFileSync(ordersPath, 'utf8');
    return JSON.parse(data);
  }
  return [];
};

// Utility to save orders to file
const saveOrders = (orders) => {
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
};

// Root route for testing
app.get('/', (req, res) => {
  res.send('Backend is running. Use the appropriate endpoints.');
});

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

// Endpoint to log orders, generate PDF invoices, and send email notifications
app.post('/log-order', async (req, res) => {
  const { customerInfo, basket, invoiceHTML } = req.body;

  if (!customerInfo || !basket || !invoiceHTML) {
    console.error('Invalid request data:', req.body);
    return res.status(400).send('Invalid request data');
  }

  const orderDataString = JSON.stringify({ customerInfo, basket });
  const orderHash = crypto.createHash('sha256').update(orderDataString).digest('hex');

  let orders = loadOrders();
  const now = new Date();

  const existingOrder = orders.find((order) => {
    return (
      order.orderHash === orderHash &&
      now - new Date(order.dateTime) < 5 * 60 * 1000
    );
  });

  if (existingOrder) {
    console.log(`Duplicate order detected for orderHash: ${orderHash}`);
    return res.status(200).send({
      message: 'Order with this data already processed recently.',
      invoiceUrl: existingOrder.invoiceUrl,
    });
  }

  const orderId = uuidv4();
  const dateTime = now.toISOString();
  let invoiceFilename = `invoice_${orderId}.pdf`;
  const invoiceFilePath = path.join(INVOICES_DIR, invoiceFilename);
  const invoiceUrl = `${req.protocol}://${req.get('host')}/invoices/${invoiceFilename}`;
  const newOrder = {
    id: orderId,
    dateTime,
    orderHash,
    customerInfo,
    basket,
    invoiceFilename,
    invoiceUrl,
    emailSent: false,
  };
  orders.push(newOrder);
  saveOrders(orders);

  try {
    await new Promise((resolve, reject) => {
      pdf.create(invoiceHTML).toFile(invoiceFilePath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    console.log(`Invoice PDF generated: ${invoiceFilePath}`);
  } catch (error) {
    console.error('Error generating PDF invoice:', error);
    return res.status(500).send('Failed to generate invoice.');
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
      .map(
        (item) =>
          `${item.brand} - ${item.flavor} ${item.type ? `(Type: ${item.type})` : ''} ${
            item.puffs ? `(Puffs: ${item.puffs})` : ''
          }, Quantity: ${item.quantity}`
      )
      .join('; ');

    const emailSubject = `New Order Received - Order ID ${orderId}`;
    const emailBody = `
      <h3>New Order Received</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Date Time:</strong> ${dateTime}</p>
      <p><strong>Customer Name:</strong> ${customerInfo.name}</p>
      <p><strong>Store Name:</strong> ${customerInfo.storeName}</p>
      <p><strong>Phone Number:</strong> ${customerInfo.phoneNumber}</p>
      <p><strong>Store Address:</strong> ${customerInfo.storeAddress}</p>
      <p><strong>Products:</strong> ${productDetails}</p>
      <p>You can also <a href="${invoiceUrl}">view the invoice online</a>.</p>
    `;

    const mailOptions = {
      from: 'ranmarcwholesale@gmail.com',
      to: wholesalerEmail,
      subject: emailSubject,
      html: emailBody,
      attachments: [
        {
          filename: invoiceFilename,
          path: invoiceFilePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully with invoice attached.');

    orders = loadOrders();
    const orderIndex = orders.findIndex((order) => order.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].emailSent = true;
      saveOrders(orders);
    }

    res.status(200).send({
      message: 'Order logged and wholesaler notified successfully.',
      invoiceUrl,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send order details to wholesaler.');
  }
});

// Serve invoices for direct access
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// Export the app for Vercel
module.exports = app;
