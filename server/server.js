const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const verificationLink = `http://localhost:5000/verify-email?token=${verificationToken}`;

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Please click on the following link to verify your email: ${verificationLink}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
