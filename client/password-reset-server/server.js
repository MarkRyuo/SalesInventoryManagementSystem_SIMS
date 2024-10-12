// server.js
const express = require('express');
const sgMail = require('@sendgrid/mail');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set your SendGrid API key

app.use(cors());
app.use(bodyParser.json());

app.post('/send-code', async (req, res) => {
    const { email, code } = req.body;

    const msg = {
        to: email,
        from: 'your-email@example.com', // Use the email you verified with SendGrid
        subject: 'Password Reset Code',
        text: `Your password reset code is ${code}.`,
    };

    try {
        await sgMail.send(msg);
        res.status(200).send('Code sent successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending code.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
