const UserText = require('../models/mongo/UserText');

// Create new text
const createUserText = async (email, userProfileId, content, title, tags) => {
    const text = new UserText({
        email,
        userProfileId,
        content,
        title: title || 'Untitled',
        tags: tags || []
    });
    return await text.save();
};

// Get all texts for a user
const getUserTexts = async (email) => {
    return await UserText.find({ email })
        .sort({ createdAt: -1 })
        .populate('userProfileId', 'firstName lastName'); // Include profile info if needed
};

// Get single text by ID
const getUserText = async (textId, email) => {
    return await UserText.findOne({ _id: textId, email })
        .populate('userProfileId', 'firstName lastName');
};

// Update text
const updateUserText = async (id, email, updates) => {
    try {
        const text = await UserText.findOneAndUpdate(
            { _id: id, email: email },
            { $set: updates },
            { new: true, runValidators: true }
        );
        return text;
    } catch (error) {
        throw new Error(`Error updating text: ${error.message}`);
    }
};

// Delete text
const deleteUserText = async (textId, email) => {
    return await UserText.findOneAndDelete({ _id: textId, email });
};

module.exports = {
    createUserText,
    getUserTexts,
    getUserText,
    updateUserText,
    deleteUserText
};