const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure your email transport using environment variables for security
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (Gmail in this case)
    auth: {
        user: functions.config().gmail.email, // Your email
        pass: functions.config().gmail.password // Your email password
    }
});

// Function to send the verification code
exports.sendCode = functions.https.onRequest(async (req, res) => {
    const { email, code } = req.body;

    try {
        // Fetch admin email from Firestore
        const adminDoc = await admin.firestore().collection("admins").doc(email).get();

        if (!adminDoc.exists) {
            return res.status(404).send("Admin not found.");
        }

        const adminData = adminDoc.data();

        // Check if the necessary email credentials are present
        if (!adminData.email) {
            return res.status(400).send("Admin email not found.");
        }

        // Send email with the verification code
        const mailOptions = {
            from: functions.config().gmail.email, // Use the configured email
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is ${code}.`
        };

        await transporter.sendMail(mailOptions);

        // Store the code in Firestore under the admins collection
        await admin.firestore().collection("admins").doc(email).set({ resetCode: code }, { merge: true });
        res.status(200).send("Code sent successfully.");
    } catch (error) {
        res.status(500).send("Error sending email: " + error);
    }
});

// Function to get the stored verification code
exports.getCode = functions.https.onRequest(async (req, res) => {
    const email = req.query.email;

    try {
        const doc = await admin.firestore().collection("admins").doc(email).get();
        if (doc.exists) {
            res.status(200).send(doc.data());
        } else {
            res.status(404).send("No code found for this email.");
        }
    } catch (error) {
        res.status(500).send("Error retrieving code: " + error);
    }
});
