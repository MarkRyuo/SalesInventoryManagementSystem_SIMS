// emailService.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Use your SendGrid API Key

export const sendEmail = async (to, subject, text) => {
    const msg = {
        to,
        from: 'your_email@example.com', // Use your verified SendGrid email
        subject,
        text,
    };
    try {
        await sgMail.send(msg);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Rethrow error to handle it later
    }
};
