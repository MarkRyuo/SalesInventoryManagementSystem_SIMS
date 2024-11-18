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

// Example download route handler
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const jsPDF = require('jspdf');
const { storage } = require('firebase-admin');
const express = require('express');
const cors = require('cors');
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

app.get('/downloadOrder', async (req, res) => {
    const orderId = req.query.id;

    // Fetch order details from Firebase Database
    const orderRef = admin.database().ref(`TransactionHistory/${orderId}`);
    const snapshot = await orderRef.once('value');
    const order = snapshot.val();

    if (order) {
        // Generate the PDF
        const doc = new jsPDF();
        doc.text('Order Details', 10, 10);
        doc.text(`Order ID: ${order.id}`, 10, 20);
        doc.text(`Customer: ${order.customerName}`, 10, 30);
        // Add other order details to the PDF as needed

        // Return the PDF as a response
        const pdfBuffer = doc.output('arraybuffer');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Order_${orderId}.pdf`);
        res.send(Buffer.from(pdfBuffer));
    } else {
        res.status(404).send('Order not found');
    }
});

exports.api = functions.https.onRequest(app);


