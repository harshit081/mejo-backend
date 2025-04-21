const express = require('express');
const router = express.Router();
const userTextController = require('../controllers/userTextController');
const auth = require('../middleware/auth');

// Create new text entry
router.post('/', auth, userTextController.createText);

// Get all texts for a user
router.get('/', auth, userTextController.getAllTexts);

// Get single text by ID
router.get('/:id', auth, userTextController.getTextById);

// Update text
router.put('/:id', auth, userTextController.updateText);
 

// Delete text
router.delete('/:id', auth, userTextController.deleteText);

module.exports = router;