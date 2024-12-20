// server.js

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
const PORT = process.env.PORT || 5000;

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

  // Validate incoming data
  if (!customerInfo || !basket || !invoiceHTML) {
    console.error('Invalid request data:', req.body);
    return res.status(400).send('Invalid request data');
  }

  // Generate a hash of the order data to detect duplicates
  const orderDataString = JSON.stringify({ customerInfo, basket });
  const orderHash = crypto.createHash('sha256').update(orderDataString).digest('hex');

  // Load existing orders
  let orders = loadOrders();

  // Get the current time
  const now = new Date();

  // Check if an identical order was placed within the last 5 minutes
  const existingOrder = orders.find((order) => {
    return (
      order.orderHash === orderHash &&
      now - new Date(order.dateTime) < 5 * 60 * 1000 // 5 minutes in milliseconds
    );
  });

  if (existingOrder) {
    console.log(`Duplicate order detected. Ignoring request for orderHash: ${orderHash}`);
    return res.status(200).send({
      message: 'Order with this data already processed recently.',
      invoiceUrl: existingOrder.invoiceUrl,
    });
  }

  // Generate a unique order ID
  const orderId = uuidv4();

  // Save the new order ID to prevent duplicate processing
  const dateTime = now.toISOString(); // Use ISO string format for consistency
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
    emailSent: false, // Email not yet sent
  };
  orders.push(newOrder);
  saveOrders(orders);

  // Generate invoice PDF
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

  // Send email with the PDF invoice attached
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ranmarcwholesale@gmail.com', // Your email
        pass: 'tqye sqdk wkwp eapq', // Replace with your email password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const wholesalerEmail = 'ranmarcwholesale@gmail.com'; // Replace with your desired recipient email

    // Update product details mapping to match the new data structure
    const productDetails = basket
      .map(
        (item) =>
          `${item.brand} - ${item.flavor} ${
            item.type ? `(Type: ${item.type})` : ''
          } ${item.puffs ? `(Puffs: ${item.puffs})` : ''}, Quantity: ${item.quantity}`
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
          path: invoiceFilePath, // Attach the generated PDF invoice
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully with invoice attached.');

    // Mark the email as sent
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

// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
