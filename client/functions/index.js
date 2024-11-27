/* eslint-disable indent */
/* eslint-disable max-len */

// eslint-disable-next-line no-unused-vars
const {onRequest} = require("firebase-functions/v2/https");
// eslint-disable-next-line no-unused-vars
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
const {jsPDF} = require("jspdf");
const qr = require("qrcode"); // For QR code generation
const twilio = require("twilio");

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
        doc.text(`₱${parseFloat(item.price).toFixed(2)}`, 140, yPosition, {align: "right"});
        doc.text(`₱${parseFloat(item.totalAmount).toFixed(2)}`, 180, yPosition, {align: "right"});
        yPosition += 10;
      });

      // Separator Line for Totals
      doc.line(10, yPosition, 200, yPosition);

      // Totals
      yPosition += 10;
      doc.text(`Subtotal: ₱${parseFloat(order.subtotal).toFixed(2)}`, 10, yPosition);
      doc.text(`Tax: ₱${parseFloat(order.tax).toFixed(2)}`, 10, yPosition + 10);
      doc.text(`Discount: -₱${parseFloat(order.discount).toFixed(2)}`, 10, yPosition + 20);
      doc.text(`Payment Amount: ₱${parseFloat(order.paymentAmount).toFixed(2)}`, 10, yPosition + 30);
      doc.text(`Change: ₱${parseFloat(order.change).toFixed(2)}`, 10, yPosition + 40);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Amount: ₱${parseFloat(order.total).toFixed(2)}`, 10, yPosition + 50);

      // Footer (Thank You Message)
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("Thank you for your purchase!", 105, yPosition + 80, {align: "center"});

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

// Initialize Firebase Admin SDK
// Twilio Phone Number Api
// Replace with your Twilio credentials
require("dotenv").config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = twilio(accountSid, authToken);


// Cloud Function to send OTP
exports.sendOtp = functions.https.onRequest(async (req, res) => {
  const {phoneNumber} = req.body; // Phone number from frontend

  try {
    // Generate a random OTP (you can use any OTP generation method)
    const otp = Math.floor(100000 + Math.random() * 900000); // Random 6-digit OTP

    // Send OTP via Twilio SMS
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: "+16812401352", // Your Twilio phone number
      to: phoneNumber,
    });

    // Optionally, you can store the OTP in Firestore temporarily
    await admin.firestore().collection("otps").doc(phoneNumber).set({
      otp: otp,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({message: "OTP sent successfully", sid: message.sid});
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({error: "Failed to send OTP"});
  }
});

// Cloud Function to verify OTP
exports.verifyOtp = functions.https.onRequest(async (req, res) => {
  const {otp, phoneNumber} = req.body;

  try {
    // Retrieve OTP from Firestore for the given phone number
    const otpDoc = await admin.firestore().collection("otps").doc(phoneNumber).get();

    if (!otpDoc.exists) {
      return res.status(400).json({error: "Phone number not found"});
    }

    const storedOtp = otpDoc.data().otp;

    if (otp === storedOtp) {
      res.status(200).json({message: "OTP verified successfully"});
    } else {
      res.status(400).json({error: "Invalid OTP"});
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({error: "Failed to verify OTP"});
  }
});

