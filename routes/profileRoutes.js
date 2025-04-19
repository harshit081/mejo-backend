const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

// Profile routes
router.get('/', auth, profileController.getProfile);
router.put('/', auth, profileController.updateProfile);
router.put('/preferences', auth, profileController.updatePreferences);

module.exports = router;