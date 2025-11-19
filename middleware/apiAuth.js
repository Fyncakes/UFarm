const { verifyToken } = require("../config/jwt");
const User = require("../models/User");
const { error } = require("./apiResponse");

/**
 * API Authentication Middleware
 * Verifies JWT token and loads full user object from database
 */
async function apiAuth(req, res, next) {
	try {
		// Get token from header
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
		
		if (!token) {
			return res.status(401).json({
				success: false,
				message: 'Access token required. Please provide token in Authorization header: Bearer <token>'
			});
		}
		
		// Verify token
		const decoded = verifyToken(token);
		
		// Load full user object from database
		const user = await User.findById(decoded.id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}
		
		// Check if user is active
		if (user.active === false) {
			return res.status(403).json({
				success: false,
				message: 'Account is deactivated'
			});
		}
		
		// Attach full user object to request
		req.user = user;
		next();
	} catch (err) {
		if (err.message === 'Invalid or expired token') {
			return res.status(403).json({
				success: false,
				message: 'Invalid or expired token',
				error: err.message
			});
		}
		return res.status(500).json({
			success: false,
			message: 'Authentication failed',
			error: err.message
		});
	}
}

module.exports = apiAuth;

