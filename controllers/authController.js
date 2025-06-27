const authService = require('../services/authService');

const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const result = await authService.signUp(email, password);
    
    // Check if this is a re-signup for unverified user
    if (result.message.includes('Account exists but not verified')) {
      return res.status(200).json({
        ...result,
        type: 'unverified_resend',
        action: 'verify_email'
      });
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.message === 'User already exists and is verified. Please login instead.') {
      return res.status(409).json({ 
        message: error.message,
        type: 'already_verified',
        action: 'login'
      });
    }
    
    if (error.message === 'Failed to create user profile') {
      return res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
    
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const { user, token } = await authService.login(email, password);
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ message: error.message });
    }
    
    if (error.message === 'Please verify your email address before logging in') {
      return res.status(403).json({ 
        message: 'Please verify your email address before logging in',
        type: 'unverified_email',
        email: req.body.email,
        action: 'verify_email'
      });
    }
    
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(500).json({ message: 'An unexpected error occurred during login' });
  }
};

const generateOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        // First find the user
        const user = await authService.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const result = await authService.generateOTP(user.id, email);
        res.json(result);
    } catch (error) {
        console.error('Generate OTP error:', error);
        res.status(400).json({ message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const verified = await authService.verifyOTP(email, otp);
        res.json({ verified });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        const result = await authService.resendOTP(email);
        res.json(result);
    } catch (error) {
        console.error('Resend OTP error:', error);
        
        if (error.message === 'User not found') {
            return res.status(404).json({ message: error.message });
        }
        
        if (error.message === 'User is already verified') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: 'Failed to resend verification code' });
    }
};

const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const resetToken = await authService.resetPasswordRequest(email);
        res.json({ resetToken });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        const user = await authService.resetPassword(resetToken, newPassword);
        res.json({ user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    signUp,
    login,
    generateOTP,
    verifyOTP,
    resendOTP,
    resetPasswordRequest,
    resetPassword,
};
