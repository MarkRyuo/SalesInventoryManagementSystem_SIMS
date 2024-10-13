const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
sgMail.setApiKey(functions.config().sendgrid.key); // Set SendGrid API key from environment variables

exports.sendVerificationEmail = functions.https.onRequest(async (req, res) => {
    const { email, verificationCode } = req.body;

    const msg = {
        to: email, // Change to your recipient
        from: 'SalesInventoryManagementSystem@gmail.com', // Change to your verified sender
        subject: 'Password Reset Verification Code',
        text: `Your verification code is ${verificationCode}`,
        html: `<strong>Your verification code is ${verificationCode}</strong>`,
    };

    try {
        await sgMail.send(msg);
        return res.status(200).send('Email sent successfully');
    } catch (error) {
        return res.status(500).send('Error sending email: ' + error.message);
    }
});
