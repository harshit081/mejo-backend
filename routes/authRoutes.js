const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/generate-otp', authController.generateOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password-request', authController.resetPasswordRequest);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
