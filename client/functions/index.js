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

exports.downloadOrder = functions
  .runWith({ timeoutSeconds: 540 }) // Increase the timeout to 9 minutes
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      const orderId = req.query.id;

      if (!orderId) {
        return res.status(400).send("Order ID is required");
      }

      try {
        // Fetch the order from Firebase
        const orderSnapshot = await admin.database().ref(`TransactionHistory/${orderId}`).once("value");
        const order = orderSnapshot.val();

        if (!order) {
          return res.status(404).send("Order not found");
        }

        // Generate PDF (you can adjust the content here)
        // eslint-disable-next-line new-cap
        const doc = new jsPDF();

        // Title and Store Info
        doc.setFont("courier", "normal");
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
        doc.text("Qty", 100, yPosition, { align: "center" });
        doc.text("Price", 140, yPosition, { align: "right" });
        doc.text("Amount", 180, yPosition, { align: "right" });

        // Product Items Loop
        yPosition += 10;
        order.items.forEach((item) => {
          doc.text(item.productName, 10, yPosition);
          doc.text(item.quantity.toString(), 100, yPosition, { align: "center" });
          doc.text(`${parseFloat(item.price).toFixed(2)}`, 140, yPosition, { align: "right" });
          doc.text(`${parseFloat(item.totalAmount).toFixed(2)}`, 180, yPosition, { align: "right" });
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
        doc.setFont("courier", "bold");
        doc.text(`Total Amount: ${parseFloat(order.total).toFixed(2)}`, 10, yPosition + 50);

        // Footer (Thank You Message)
        doc.setFontSize(10);
        doc.setFont("courier", "italic");
        doc.text("This is not official receipt!", 105, yPosition + 80, { align: "center" });

        // Generate QR code
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


const nodemailer = require('nodemailer');

// Initialize Firebase Admin SDK
admin.initializeApp();

// CORS handler
const corsHandler = cors({ origin: true });

// Constants
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // OTP expiry time (5 minutes)

// Create a transporter for sending OTP email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465, // Use port 465 for secure connection
  secure: true, // Set to true for SSL
  auth: {
    user: process.env.EMAIL_USER, // Your email address from environment variables
    pass: process.env.EMAIL_PASS, // Your email password from environment variables
  },
});

// Cloud Function to generate OTP and send via email
exports.generateOtp = functions.runWith({ memory: '256MB', timeoutSeconds: 60 })
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      const { email } = req.body; // Get the email from the request body

      if (!email) {
        return res.status(400).send({ error: 'Email is required' });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit OTP

      // Firestore reference to store OTP
      const otpRef = admin.firestore().collection('otps').doc(email);

      try {
        // Store OTP in Firestore with expiration time
        await otpRef.set({
          otp,
          expiresAt: Date.now() + OTP_EXPIRY_TIME, // Expiry time of 5 minutes
        });

        // Send OTP email to the user
        await transporter.sendMail({
          from: 'salesinventorymanagementsystem@gmail.com', // Your email address
          to: email, // Recipient email
          subject: 'Your OTP for Verification',
          text: `Hello,

          Your One-Time Password (OTP) for verifying is: ${otp}

          Please use this code to complete your verification process. The OTP is valid for a short time only.

          Best regards,
          Sales Inventory Management System Team`,
        });

        // Respond with a success message
        res.status(200).send({ message: 'OTP sent successfully' });
      } catch (err) {
        // Log and return error details if sending email fails
        console.error('Error sending OTP email:', err);
        res.status(500).send({
          error: 'Failed to send OTP',
          details: err.message || 'Unknown error',
        });
      }
    });
  });

// Cloud Function to verify OTP
exports.verifyOtp = functions.runWith({ memory: '256MB', timeoutSeconds: 60 })
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      const { email, otp } = req.body; // Get email and OTP from the request body

      if (!email || !otp) {
        return res.status(400).send({ error: 'Email and OTP are required' });
      }

      // Firestore reference to retrieve OTP stored for the email
      const otpRef = admin.firestore().collection('otps').doc(email);

      try {
        // Fetch OTP from Firestore
        const otpDoc = await otpRef.get();

        if (!otpDoc.exists) {
          return res.status(400).send({ error: 'OTP not found for this email' });
        }

        const storedOtp = otpDoc.data().otp;
        const expiresAt = otpDoc.data().expiresAt;

        // Check if OTP has expired
        if (Date.now() > expiresAt) {
          return res.status(400).send({ error: 'OTP has expired' });
        }

        // Check if OTP is valid
        if (storedOtp !== otp) {
          return res.status(400).send({ error: 'Invalid OTP' });
        }

        // OTP is valid, you can now mark this as verified or proceed with your logic
        res.status(200).send({ message: 'OTP verified successfully' });

        // Optionally, you can delete the OTP from Firestore after successful verification
        await otpRef.delete();
      } catch (err) {
        // Log and return error details if verification fails
        console.error('Error verifying OTP:', err);
        res.status(500).send({
          error: 'Failed to verify OTP',
          details: err.message || 'Unknown error',
        });
      }
    });
  });


