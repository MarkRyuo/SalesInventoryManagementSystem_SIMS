/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { jsPDF } = require('jspdf');
const QRious = require('qrious');
const express = require('express');
const app = express();

admin.initializeApp();

// Generate and Serve PDF when URL with `order.id` is accessed
app.get('/generate-pdf', async (req, res) => {
    const orderId = req.query.id;

    if (!orderId) {
        return res.status(400).send('Order ID is required');
    }

    // Fetch order details from Firestore (replace with your logic)
    const orderRef = admin.firestore().collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
        return res.status(404).send('Order not found');
    }

    const order = orderDoc.data();
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Receipt', 105, 20, { align: 'center' });

    // Order details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order Date: ${order.date}`, 10, 40);
    doc.text(`Sold To: ${order.customerName}`, 10, 50);
    doc.text(`Order ID: ${order.id}`, 10, 60);

    // Pricing Breakdown using Unicode for Peso Symbol
    doc.text(`Subtotal: \u20B1${order.subtotal.toFixed(2)}`, 10, 70);
    doc.text(`Tax (12%): \u20B1${order.tax.toFixed(2)}`, 10, 80);
    doc.text(`Discount: -\u20B1${order.discount.toFixed(2)}`, 10, 90);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: \u20B1${order.total.toFixed(2)}`, 10, 110);

    // Generate QR Code
    const qr = new QRious({
        value: `https://salesinventorymanagement-1bb27.web.app/ProductPage?id=${order.id}`,
        size: 100,
    });
    const qrImage = qr.toDataURL();
    doc.addImage(qrImage, 'PNG', 150, 60, 50, 50);

    // Footer Message
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your purchase!', 105, 150, { align: 'center' });

    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Order_${order.id}.pdf`);
    res.send(doc.output('arraybuffer'));  // Sends the PDF content to the client
});

// Export the function
exports.app = functions.https.onRequest(app);

