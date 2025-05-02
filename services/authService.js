const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');  // Add this import
const { Users, Token, OTP, PasswordReset } = require('../models');
const sendEmail = require('../config/nodemailer');
const UserProfile = require('../models/mongo/UserProfile');

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
    
    // Create initial UserProfile in MongoDB
    try {
        await UserProfile.create({
            userId: newUser.id,
            email: email.toLowerCase(),
            firstName: null,
            lastName: null,
            dateOfBirth: null,
            gender: 'prefer not to say',
            phoneNumber: null,
            address: {
                street: null,
                city: null,
                state: null,
                country: null,
                zipCode: null
            },
            bio: null
        });
    } catch (error) {
        // If MongoDB profile creation fails, delete the PostgreSQL user
        await newUser.destroy();
        throw new Error('Failed to create user profile');
    }

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
    // Generate OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP valid for 10 minutes
    
    // Store in database
    await OTP.upsert({
        email,
        otp,
        expiresAt
    });
    
    // Try to send email but don't fail if it doesn't work
    try {
        const emailResult = await sendEmail({
            to: email,
            subject: "Your Verification Code",
            html: `<p>Your verification code is: <strong>${otp}</strong></p>
                  <p>This code will expire in 10 minutes.</p>`
        });
        
        if (emailResult.error) {
            console.warn(`Email could not be sent to ${email}: ${emailResult.message}`);
        }
    } catch (error) {
        console.warn(`Failed to send OTP email: ${error.message}`);
        // Continue execution instead of failing
    }
    
    return { success: true };
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
