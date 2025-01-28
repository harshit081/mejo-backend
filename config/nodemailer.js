const nodemailer = require('nodemailer');
const config = require('./config');
// Configure the transporter with your email service credentials
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., Gmail, Outlook, etc.)
    auth: {
        user: config.email_user, // Your email address
        pass: config.email_password, // Your email password or app password
    },
});

console.log(config.email_user,config.email_password)

// Function to send email
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: config.email_user, // Sender address
        to, // Recipient address
        subject, // Email subject
        text, // Email body
    };

    await transporter.sendMail(mailOptions);
};


module.exports = sendEmail;