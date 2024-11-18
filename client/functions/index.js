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

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.createDynamicLink = functions.https.onCall(async (data, context) => {
    const productId = data.productId;
    const dynamicLinksDomain = "https://salesinventorymanagement-1bb27.web.app/"; // Palitan sa domain mo

    const link = `https://salesinventorymanagement-1bb27.web.app/ProductPage/${productId}`;
    const response = await admin.dynamicLinks.createLink({
        longDynamicLink: `${dynamicLinksDomain}/?link=${link}&apn=com.yourapp.package`,
        suffix: { option: "SHORT" }
    });

    return response;
});

