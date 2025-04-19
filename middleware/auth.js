const jwt = require('jsonwebtoken');
const config = require('../config/config');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log("Received token:", token); // Debug log

        if (!token) {
            throw new Error('Authentication token missing');
        }

        const decoded = jwt.verify(token, config.jwtSecret);
        console.log("Decoded token:", decoded); // Debug log

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error); // Debug log
        res.status(401).json({ message: 'Please authenticate' });
    }
};

module.exports = auth;