const authService = require('../services/authService');

    const signUp = async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log("signup",1)
            const result = await authService.signUp(email, password);
            res.status(201).json(result);
        } catch (error) {
            if (error.message === 'Failed to create user profile') {
                res.status(500).json({ message: 'Registration failed. Please try again.' });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    };

    const login = async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log("login",1)
            const { user, token } = await authService.login(email, password);
            console.log("login",1.9)
            res.json({ user, token });
        } catch (error) {
            res.status(400).json({ message: error.message });
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
