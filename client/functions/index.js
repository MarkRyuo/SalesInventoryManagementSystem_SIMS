/* eslint-disable indent */
/* eslint-disable max-len */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
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

      // Title
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Receipt", 105, 20, {align: "center"});

      // Order Details
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Order Date: ${order.date}`, 10, 40);
      doc.text(`Sold To: ${order.customerName}`, 10, 50);
      doc.text(`Order ID: ${orderId}`, 10, 60);

      // Pricing Breakdown
      doc.text(`Subtotal: \u20B1${order.subtotal.toFixed(2)}`, 10, 70);
      doc.text(`Tax: \u20B1${order.tax.toFixed(2)}`, 10, 80);
      doc.text(`Discount: -\u20B1${order.discount.toFixed(2)}`, 10, 90);
      doc.text(`Payment Amount: \u20B1${parseFloat(order.paymentAmount).toFixed(2)}`, 10, 100);
      doc.text(`Change: \u20B1${parseFloat(order.change).toFixed(2)}`, 10, 110);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Amount: \u20B1${order.total.toFixed(2)}`, 10, 120);

      // Generate QR code (you can customize it as per your needs)
      const qrCodeData = await qr.toDataURL(`https://us-central1-salesinventorymanagement-1bb27.cloudfunctions.net/downloadOrder?id=${orderId}`);
      doc.addImage(qrCodeData, "PNG", 150, 10, 50, 50);

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your purchase!", 105, 150, {align: "center"});

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
