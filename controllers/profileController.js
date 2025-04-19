const UserProfile = require('../models/mongo/UserProfile');

const getProfile = async (req, res) => {
    try {
        console.log("Getting profile for user:", req.user.email); // Debug log
        const profile = await UserProfile.findOne({ email: req.user.email });
        
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        
        console.log("Found profile:", profile); // Debug log
        res.json(profile);
    } catch (error) {
        console.error("Profile fetch error:", error); // Debug log
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        console.log("Updating profile for user:", req.user.email); // Debug log
        console.log("Update data:", req.body); // Debug log
        
        const updates = req.body;
        delete updates._id;

        const profile = await UserProfile.findOneAndUpdate(
            { email: req.user.email },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        console.log("Updated profile:", profile); // Debug log
        res.json(profile);
    } catch (error) {
        console.error("Profile update error:", error); // Debug log
        res.status(400).json({ message: error.message });
    }
};

const updatePreferences = async (req, res) => {
    try {
        const { preferences } = req.body;
        
        const profile = await UserProfile.findOneAndUpdate(
            { email: req.user.email },
            { $set: { preferences } },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updatePreferences
};