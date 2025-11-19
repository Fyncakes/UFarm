const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token for user
 * @param {Object} user - User object from database
 * @returns {String} JWT token
 */
function generateToken(user) {
	const payload = {
		id: user._id,
		username: user.Name1,
		role: user.role,
		email: user.email
	};
	
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN
	});
}

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		throw new Error('Invalid or expired token');
	}
}

/**
 * Middleware to authenticate API requests using JWT
 */
function authenticateToken(req, res, next) {
	// Get token from header
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
	
	if (!token) {
		return res.status(401).json({
			success: false,
			message: 'Access token required. Please provide token in Authorization header: Bearer <token>'
		});
	}
	
	try {
		const decoded = verifyToken(token);
		req.user = decoded; // Attach user info to request
		next();
	} catch (error) {
		return res.status(403).json({
			success: false,
			message: 'Invalid or expired token',
			error: error.message
		});
	}
}

module.exports = {
	generateToken,
	verifyToken,
	authenticateToken,
	JWT_SECRET
};

