/* eslint-disable indent */
/* eslint-disable max-len */

const {onRequest} = require("firebase-functions/v2/https");
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

      // Header - Store Info and Title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Reyes Electronics", 105, 20, {align: "center"}); // Store name in center

      doc.setFontSize(22);
      doc.text("Receipt", 105, 30, {align: "center"}); // Receipt Title

      // Order Details Section
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Order Date: ${order.date}`, 10, 50);
      doc.text(`Sold To: ${order.customerName}`, 10, 60);
      doc.text(`Order ID: ${orderId}`, 10, 70);

      // Pricing Breakdown Section
      doc.text(`Subtotal: \u20B1${order.subtotal.toFixed(2)}`, 10, 80);
      doc.text(`Tax: \u20B1${order.tax.toFixed(2)}`, 10, 90);
      doc.text(`Discount: -\u20B1${order.discount.toFixed(2)}`, 10, 100);
      doc.text(`Payment Amount: \u20B1${parseFloat(order.paymentAmount).toFixed(2)}`, 10, 110);
      doc.text(`Change: \u20B1${parseFloat(order.change).toFixed(2)}`, 10, 120);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Amount: \u20B1${order.total.toFixed(2)}`, 10, 130);

      // Items List - Displaying product items
      doc.setFontSize(12);
      let yPosition = 140; // Start y position for items listing
      order.items.forEach((item) => {
        doc.text(`${item.productName} - ${item.quantity} x \u20B1${item.price.toFixed(2)}`, 10, yPosition);
        yPosition += 10; // Increment y position for each item
      });

      // Footer - Thank you message and QR code
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("Thank you for your purchase!", 105, yPosition + 20, {align: "center"});

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
admin.initializeApp();

// Replace with your Twilio credentials
const accountSid = "AC498aada106ec5351f44aa2cc33d22dd2";
const authToken = "822891c4c2b634a8ef58b620d5571c5b";
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
      res.status(200).json({message: "OTP verified successfully" });
    } else {
      res.status(400).json({error: "Invalid OTP"});
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({error: "Failed to verify OTP"});
  }
});

