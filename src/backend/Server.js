// src/backend/Server.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');  // <-- Use puppeteer instead of puppeteer-core
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// Puppeteer browser initialization
let browser;
(async () => {
  try {
    browser = await puppeteer.launch({
      headless: true, // or "new" if you're on Puppeteer 19+ and want the new headless mode
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process',
        '--font-render-hinting=none',
      ],
    });
  } catch (error) {
    console.error('Error launching Puppeteer:', error);
  }
})();

// Use CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Replace with your Google Sheet's published CSV URL
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS9yTFEyHsOfYjdzQtOriWq0s5EuxhYNrRyqxCYKeTROfW4tMvfPzB84q6f8V2C8Tt-Zmi90lcYKsCS/pub?output=csv';

// File paths
const ordersPath = path.join(__dirname, 'orders.json');
const INVOICES_DIR = path.join(__dirname, 'invoices');
if (!fs.existsSync(INVOICES_DIR)) {
  fs.mkdirSync(INVOICES_DIR);
}

// Utility to load orders from file
function loadOrders() {
  if (fs.existsSync(ordersPath)) {
    const data = fs.readFileSync(ordersPath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// Utility to save orders to file
function saveOrders(orders) {
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
}

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
    console.error('Invalid request data:', { customerInfo, basket, invoiceHTML });
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const orderDataString = JSON.stringify({ customerInfo, basket });
  const orderHash = crypto.createHash('sha256').update(orderDataString).digest('hex');

  let orders = loadOrders();
  const now = new Date();

  // Check if an identical order has been processed in the past 5 minutes
  const existingOrder = orders.find((order) => {
    return (
      order.orderHash === orderHash &&
      now - new Date(order.dateTime) < 5 * 60 * 1000
    );
  });

  if (existingOrder) {
    console.log(
      `Duplicate order detected. Ignoring request for orderHash: ${orderHash}`
    );
    return res.status(200).send({
      message: 'Order with this data already processed recently.',
      invoiceUrl: existingOrder.invoiceUrl,
    });
  }

  const orderId = uuidv4();
  const dateTime = now.toISOString();
  const invoiceFilename = `invoice_${orderId}.pdf`;
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

  // Generate invoice PDF using Puppeteer
  try {
    const page = await browser.newPage();
    await page.setContent(invoiceHTML, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('screen');

    await page.pdf({
      path: invoiceFilePath,
      format: 'A4',
      printBackground: true,
    });

    await page.close();
    console.log(`Invoice PDF generated: ${invoiceFilePath}`);
  } catch (error) {
    console.error('Error generating PDF invoice with Puppeteer:', error);
    return res.status(500).json({ message: 'Failed to generate invoice.' });
  }

  // Send email with attached invoice
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
          `${item.brand} - ${item.flavor}${
            item.type ? ` (Type: ${item.type})` : ''
          }${item.puffs ? ` (Puffs: ${item.puffs})` : ''}, Quantity: ${
            item.quantity
          }`
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

    // Mark this order's email as sent
    orders = loadOrders();
    const orderIndex = orders.findIndex((order) => order.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].emailSent = true;
      saveOrders(orders);
    }

    return res.status(200).send({
      message: 'Order logged and wholesaler notified successfully.',
      invoiceUrl,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).send('Failed to send order details to wholesaler.');
  }
});

// Serve invoices for direct access
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
