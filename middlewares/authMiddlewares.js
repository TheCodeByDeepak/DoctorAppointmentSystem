const jwt = require('jsonwebtoken');
const JWT_SECRET = 'ABCD'; // Replace with your actual secret key

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log('Authorization header missing');
        return res.status(401).send({ message: 'Authorization header missing', success: false });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('Token missing');
        return res.status(401).send({ message: 'Token missing', success: false });
    }

    try {
        console.log('Token:', token);
        console.log('Secret:', JWT_SECRET);
        
        if (!JWT_SECRET) {
            console.log('JWT_SECRET is not defined');
            return res.status(500).send({ message: 'Internal Server Error: JWT_SECRET is not defined', success: false });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded:', decoded);
        
        req.body.userId = decoded.userId;
        next();
    } catch (err) {
        console.log('Token verification error:', err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({ message: 'Token expired', success: false });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).send({ message: 'Invalid token', success: false });
        } else {
            return res.status(401).send({ message: 'Token verification failed', success: false });
        }
    }
};