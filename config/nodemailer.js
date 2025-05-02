const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = null;

// Create transporter only if credentials exist
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
}

const sendEmail = async (options) => {
    // If transporter wasn't configured, log error but don't crash
    if (!transporter) {
        console.error("Email not sent: Email configuration missing");
        return { 
            error: true, 
            message: "Email service not configured" 
        };
    }

    try {
        const mailOptions = {
            from: `"Mejo App" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        return { 
            error: true, 
            message: `Failed to send email: ${error.message}` 
        };
    }
};

module.exports = sendEmail;