const nodemailer = require('nodemailer');
require('dotenv').config();

// Add validation for environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email configuration is missing. Please check your .env file.');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Only verify connection in development environment
if (process.env.NODE_ENV !== 'production') {
    transporter.verify(function (error, success) {
        if (error) {
            console.error('SMTP configuration error:', error);
        } else {
            console.log('SMTP server is ready to send emails');
        }
    });
}

const sendEmail = async (options) => {
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
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = sendEmail;