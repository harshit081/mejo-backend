const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');  // Add this import
const { Users, Token, OTP, PasswordReset } = require('../models');
const sendEmail = require('../config/nodemailer');

// Generate JWT token
const generateToken = (user) => {
    const payload = { id: user.id, email: user.email };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Sign up user
const signUp = async (email, password) => {
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({ 
        email, 
        password: hashedPassword,
        isVerified: false
    });

    // Generate and send OTP for email verification
    await generateOTP(email);

    return { 
        message: 'User created successfully. OTP sent for email verification.',
        user: {
            id: newUser.id,
            email: newUser.email,
            isVerified: newUser.isVerified
        }
    };
};

//Login User
const login = async (email, password) => {
    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    if (!user.isVerified) {
        throw new Error('Please verify your email address before logging in');
    }

    // Remove expired tokens
    await Token.destroy({ 
        where: { 
            userid: user.id, 
            expiresAt: { [Op.lt]: new Date() } 
        } 
    });

    const token = generateToken(user);
    await Token.create({ 
        userid: user.id, 
        token, 
        expiresAt: new Date(Date.now() + 3600 * 1000) 
    });

    return { 
        user: { 
            id: user.id, 
            email: user.email, 
            isVerified: user.isVerified 
        }, 
        token 
    };
};


// OTP generation for email verification
const generateOTP = async (email) => {
    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const existingOTP = await OTP.findOne({ 
        where: { 
            userid: user.id,
            verified: false 
        } 
    });
    
    if (existingOTP) throw new Error('An OTP has already been sent. Please wait before requesting another.');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await OTP.create({ 
        userid: user.id,
        otp, 
        expiresAt: otpExpiresAt 
    });

    // Send OTP via email
    const emailOptions = {
        to: email,
        subject: 'Email Verification OTP',
        html: `
            <h1>Email Verification</h1>
            <p>Your OTP for email verification is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 15 minutes.</p>
        `
    };

    try {
        await sendEmail(emailOptions);
        console.log("OTP Sent to email:", email);
        return 'OTP sent to your email address';
    } catch (error) {
        // If email fails, delete the OTP record
        await OTP.destroy({ where: { userid: user.id, otp } });
        throw new Error('Failed to send OTP email. Please try again.');
    }
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

    // Update user verification status
    user.isVerified = true;
    await user.save();

    return { message: 'Email verified successfully' };
};


// Password reset request
const resetPasswordRequest = async (email) => {
    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const resetToken = Math.random().toString(36).substring(2);
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await PasswordReset.create({ id: user.id, resetToken: hashedToken, expiresAt });

    return 'Password reset token sent to your email address';
};


const resetPassword = async (resetToken, newPassword) => {
    const resetRequests = await PasswordReset.findAll();
    const validRequest = resetRequests.find(request => bcrypt.compareSync(resetToken, request.resetToken));
    
    if (!validRequest) throw new Error('Invalid reset token');
    if (validRequest.expiresAt < new Date()) throw new Error('Reset token has expired');

    const user = await Users.findByPk(validRequest.userid);
    if (!user) throw new Error('User not found');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'Password reset successfully' };
};


module.exports = {
    signUp,
    login,
    generateOTP,
    verifyOTP,
    resetPasswordRequest,
    resetPassword,
};
