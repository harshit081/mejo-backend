const userTextService = require('../services/userTextService');
const UserProfile = require('../models/mongo/UserProfile');

const createText = async (req, res) => {
    try {
        const { content, title, tags } = req.body;
        const email = req.user.email;

        // Get UserProfile ID
        const userProfile = await UserProfile.findOne({ email });
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found. Please create a profile first.' });
        }

        const savedText = await userTextService.createUserText(
            email,
            userProfile._id,
            content,
            title,
            tags
        );

        res.status(201).json(savedText);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllTexts = async (req, res) => {
    try {
        const email = req.user.email;
        const texts = await userTextService.getUserTexts(email);
        res.json(texts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTextById = async (req, res) => {
    try {
        const email = req.user.email;
        const text = await userTextService.getUserText(req.params.id, email);
        if (!text) {
            return res.status(404).json({ message: 'Text not found' });
        }
        res.json(text);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateText = async (req, res) => {
    try {
        const { content, title, tags } = req.body;
        const email = req.user.email;

        if (!title && title !== '') {
            return res.status(400).json({ message: 'Title is required' });
        }

        const updatedText = await userTextService.updateUserText(
            req.params.id,
            email,
            { content, title, tags }
        );

        if (!updatedText) {
            return res.status(404).json({ message: 'Text not found' });
        }

        res.json(updatedText);
    } catch (error) {
        console.error('Error updating text:', error);
        res.status(500).json({ message: error.message });
    }
};

const deleteText = async (req, res) => {
    try {
        const email = req.user.email;
        const result = await userTextService.deleteUserText(req.params.id, email);
        if (!result) {
            return res.status(404).json({ message: 'Text not found' });
        }
        res.json({ message: 'Text deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createText,
    getAllTexts,
    getTextById,
    updateText,
    deleteText
};