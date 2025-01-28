const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const { Token } = require('../models');
const { OTP } = require('../models');
const { PasswordReset } = require('../models');
const sendEmail = require('../config/nodemailer');

// Generate JWT token
const generateToken = (user) => {
    const payload = { id: user.id, email: user.email };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Sign up user
const signUp = async (email, password) => {
    console.log(1)
    console.log(email)
    const existingUser = await Users.findOne({ where: { email } });
    console.log(2)
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({ email, password: hashedPassword });

    // Generate and send OTP for email verification
    await generateOTP(email);

    return { message: 'User created successfully. OTP sent for email verification.' };
};


// Login user
const login = async (email, password) => {
    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const token = generateToken(user);
    await Token.create({ userid: user.id, token, expiresAt: new Date(Date.now() + 3600 * 1000) });

    return { user, token };
};

// OTP generation for email verification

// OTP generation for email verification
const generateOTP = async (email) => {
    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
    console.log(3)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes
    console.log(4)
    console.log(5,user.id)
    const id = user.id
    await OTP.create({ userid: id, otp, expiresAt: otpExpiresAt });
    console.log(6)
    // Send OTP via email
    const subject = 'Your OTP for verification';
    const text = `Your OTP is ${otp}. It is valid for 15 minutes.`;
    await sendEmail(email, subject, text);
    console.log(7)

    return 'OTP sent to your email address'; // Response message
};


// Verify OTP
const verifyOTP = async (email, otp) => {
    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const otpRecord = await OTP.findOne({ where: { userid: user.id, otp, verified: false } });
    if (!otpRecord) throw new Error('Invalid OTP');

    if (otpRecord.expiresAt < new Date()) throw new Error('OTP has expired');

    otpRecord.verified = true;
    await otpRecord.save();

    return { message: 'OTP verified successfully' };
};


// Password reset request
const resetPasswordRequest = async (email) => {
    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const resetToken = Math.random().toString(36).substring(2);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // Expires in 30 minutes

    await PasswordReset.create({ userid: user.id, resetToken, expiresAt });

    // Send reset token via email
    const subject = 'Password Reset Request';
    const text = `Your password reset token is ${resetToken}. It is valid for 30 minutes.`;
    await sendEmail(email, subject, text);

    return 'Password reset token sent to your email address';
};


// Reset password
const resetPassword = async (resetToken, newPassword) => {
    const resetRequest = await PasswordReset.findOne({ where: { resetToken } });
    if (!resetRequest) throw new Error('Invalid reset token');
    console.log(1.1)
    if (resetRequest.expiresAt < new Date()) throw new Error('Reset token has expired');
    console.log(1.2)
    console.log(resetRequest.userid)
    const user = await Users.findByPk(resetRequest.userid);
    console.log(1.3)
    console.log(user)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(1.4)
    user.password = hashedPassword;
    await user.save();

    return user;
};

module.exports = {
    signUp,
    login,
    generateOTP,
    verifyOTP,
    resetPasswordRequest,
    resetPassword,
};
