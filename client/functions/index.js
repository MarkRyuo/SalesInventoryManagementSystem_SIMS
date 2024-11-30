/* eslint-disable object-curly-spacing */
/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable max-len */

// eslint-disable-next-line no-unused-vars
const {onRequest} = require("firebase-functions/v2/https");
// eslint-disable-next-line no-unused-vars
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const {jsPDF} = require("jspdf");
const qr = require("qrcode"); // For QR code generation

admin.initializeApp();

// Function to handle the download
exports.downloadOrder = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const orderId = req.query.id;

    if (!orderId) {
      return res.status(400).send("Order ID is required");
    }

    try {
      // Fetch the order from Firebase
      // eslint-disable-next-line max-len
      const orderSnapshot = await admin.database().ref(`TransactionHistory/${orderId}`).once("value");
      const order = orderSnapshot.val();

      if (!order) {
        return res.status(404).send("Order not found");
      }

      // Generate PDF (you can adjust the content here)
      // eslint-disable-next-line new-cap
      const doc = new jsPDF();

      // Title and Store Info
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("REYES ELECTRONIC SHOP", 10, 20);
      doc.setFontSize(10);
      doc.text("JP Rizal St. Población Barangay 4, 4217 Lipa City Batangas Philippines", 10, 30);
      doc.text("RAMIL P. REYES - PROP.", 10, 40);

      // Order Date and Customer Info
      doc.setFontSize(12);
      doc.text(`Order Date: ${order.date}`, 10, 50);
      doc.text(`Sold To: ${order.customerName}`, 10, 60);

      // Separator Line
      doc.line(10, 65, 200, 65);

      // Product Table Header
      let yPosition = 75;
      doc.setFontSize(10);
      doc.text("Product Name", 10, yPosition);
      doc.text("Qty", 100, yPosition, {align: "center"});
      doc.text("Price", 140, yPosition, {align: "right"});
      doc.text("Amount", 180, yPosition, {align: "right"});

      // Product Items Loop
      yPosition += 10;
      order.items.forEach((item) => {
        doc.text(item.productName, 10, yPosition);
        doc.text(item.quantity.toString(), 100, yPosition, {align: "center"});
        doc.text(`${parseFloat(item.price).toFixed(2)}`, 140, yPosition, {align: "right"});
        doc.text(`${parseFloat(item.totalAmount).toFixed(2)}`, 180, yPosition, {align: "right"});
        yPosition += 10;
      });

      // Separator Line for Totals
      doc.line(10, yPosition, 200, yPosition);

      // Totals
      yPosition += 10;
      doc.text(`Subtotal: ${parseFloat(order.subtotal).toFixed(2)}`, 10, yPosition);
      doc.text(`Tax: ${parseFloat(order.tax).toFixed(2)}`, 10, yPosition + 10);
      doc.text(`Discount: -${parseFloat(order.discount).toFixed(2)}`, 10, yPosition + 20);
      doc.text(`Payment Amount: ${parseFloat(order.paymentAmount).toFixed(2)}`, 10, yPosition + 30);
      doc.text(`Change: ${parseFloat(order.change).toFixed(2)}`, 10, yPosition + 40);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Amount: ${parseFloat(order.total).toFixed(2)}`, 10, yPosition + 50);

      // Footer (Thank You Message)
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("This is not official receipt!", 105, yPosition + 80, {align: "center"});

      // Generate QR code (you can customize it as per your needs)
      const qrCodeData = await qr.toDataURL(`https://us-central1-salesinventorymanagement-1bb27.cloudfunctions.net/downloadOrder?id=${orderId}`);
      doc.addImage(qrCodeData, "PNG", 150, 10, 50, 50);

      // Send PDF to the client
      const pdfOutput = doc.output("arraybuffer");
      res.set("Content-Type", "application/pdf");
      res.set("Content-Disposition", "attachment; filename=order_receipt.pdf");
      res.send(Buffer.from(pdfOutput));
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).send("Error generating PDF");
    }
  });
});


require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

// Configure CORS to allow requests from your frontend domain
app.use(cors({
  origin: [
    "http://localhost:5173", // Frontend local dev URL
    "http://127.0.0.1:5001", // Another local dev URL
  ],
  methods: ['GET', 'POST'], // Allow only POST and GET requests
  allowedHeaders: ['Content-Type'], // Allow only Content-Type header
}));

// Body parser middleware
app.use(bodyParser.json());

const otps = {}; // Store OTPs temporarily

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465, // Use port 465 for secure connection
  secure: true, // Set to true for SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP endpoint
app.post('/generate-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = otp;

  try {
    // Attempt to send the email
    await transporter.sendMail({
      from: 'salesinventorymanagementsystem@gmail.com', // Your email address
      to: email,
      subject: 'Your OTP',
      text: `Your OTP is ${otp}`,
    });
    res.status(200).send({ message: 'OTP sent' });
  } catch (err) {
    // Log the error for debugging
    console.error('Error sending email:', err);

    // Send a detailed error message to the client
    res.status(500).send({
      error: 'Failed to send OTP',
      details: err.message || 'Unknown error',
    });
  }
});


// Validate OTP endpoint
app.post('/validate-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otps[email] === otp) {
    delete otps[email];
    res.status(200).send({ message: 'OTP verified' });
  } else {
    res.status(400).send({ error: 'Invalid OTP' });
  }
});

// Firebase function to handle the Express app
exports.api = functions.https.onRequest(app);

