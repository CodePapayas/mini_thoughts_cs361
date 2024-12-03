const jwt = require('jsonwebtoken');
require('dotenv').config();

const KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Check if Authorization header is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Token is required.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part

    try {
        // Verify the token
        const decoded = jwt.verify(token, KEY);

        // Attach user info to request
        req.user = decoded;

        // Proceed to the next middleware or route
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = verifyToken;
