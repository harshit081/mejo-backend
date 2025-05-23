const authService = require('../services/authService');

const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const result = await authService.signUp(email, password);
    res.status(201).json(result);
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.message === 'User already exists') {
      return res.status(409).json({ message: error.message });
    }
    
    if (error.message === 'Failed to create user profile') {
      res.status(500).json({ message: 'Registration failed. Please try again.' });
    } else {    
    res.status(400).json({ message: error.message });
}
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
    
    res.status(500).json({ message: 'An unexpected error occurred during login' });
  }
};

const generateOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = await authService.generateOTP(email);
        res.json({ otp });
    } catch (error) {
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
    resetPasswordRequest,
    resetPassword,
};
