const mongoose = require('mongoose');

const userTextSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
        trim: true,
        lowercase: true,
    },
    userProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: 'Untitled'
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

// Add compound index for better query performance
userTextSchema.index({ email: 1, userProfileId: 1 });

const UserText = mongoose.model('UserText', userTextSchema);

module.exports = UserText;