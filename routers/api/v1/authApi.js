const express = require("express");
const router = express.Router();
const User = require("../../../models/User");
const { generateToken } = require("../../../config/jwt");
const { success, error, validationError } = require("../../../middleware/apiResponse");

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		
		if (!username || !password) {
			return validationError(res, {
				username: username ? undefined : 'Username is required',
				password: password ? undefined : 'Password is required'
			});
		}
		
		// Find user
		const user = await User.findOne({ Name1: username });
		if (!user) {
			return error(res, 'Invalid username or password', 401);
		}
		
		// Verify password
		const isValid = await user.authenticate(password);
		if (!isValid) {
			return error(res, 'Invalid username or password', 401);
		}
		
		// Check if user is active
		if (user.active === false) {
			return error(res, 'Account is deactivated. Please contact administrator.', 403);
		}
		
		// Generate JWT token
		const token = generateToken(user);
		
		// Return user data (without sensitive info) and token
		const userData = {
			id: user._id,
			username: user.Name1,
			email: user.email,
			role: user.role,
			verified: user.verified,
			profileImage: user.profileImage
		};
		
		success(res, {
			user: userData,
			token,
			tokenType: 'Bearer'
		}, 'Login successful');
	} catch (err) {
		console.error("API Login error:", err);
		error(res, 'Login failed. Please try again.', 500);
	}
});

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user (buyer/customer only)
 * @access  Public
 */
router.post("/register", async (req, res) => {
	try {
		const { username, email, phonenumber, password, confirmPassword } = req.body;
		
		// Validation
		if (!username || !email || !phonenumber || !password) {
			return validationError(res, {
				username: username ? undefined : 'Username is required',
				email: email ? undefined : 'Email is required',
				phonenumber: phonenumber ? undefined : 'Phone number is required',
				password: password ? undefined : 'Password is required'
			});
		}
		
		if (password !== confirmPassword) {
			return validationError(res, {
				confirmPassword: 'Passwords do not match'
			});
		}
		
		// Check if username exists
		const existingUser = await User.findOne({ Name1: username });
		if (existingUser) {
			return error(res, 'Username already exists', 409);
		}
		
		// Create user (only "user" role allowed for public registration)
		const userData = {
			Name1: username,
			email,
			phonenumber,
			role: 'user'
		};
		
		const user = new User(userData);
		
		// Register with password using promise wrapper
		try {
			await new Promise((resolve, reject) => {
				User.register(user, password, (err) => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
			
			// Reload user to get full data
			const savedUser = await User.findById(user._id);
			
			// Generate token for new user
			const token = generateToken(savedUser);
			
			const userResponse = {
				id: savedUser._id,
				username: savedUser.Name1,
				email: savedUser.email,
				role: savedUser.role
			};
			
			success(res, {
				user: userResponse,
				token,
				tokenType: 'Bearer'
			}, 'Registration successful', 201);
		} catch (err) {
			if (err.name === 'UserExistsError') {
				return error(res, 'Username already exists', 409);
			}
			throw err;
		}
	} catch (err) {
		console.error("API Registration error:", err);
		error(res, 'Registration failed', 500);
	}
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", require("../../../middleware/apiAuth"), async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
			.select('-hash -salt -__v');
		
		if (!user) {
			return error(res, 'User not found', 404);
		}
		
		success(res, { user }, 'User profile retrieved');
	} catch (err) {
		console.error("API Get user error:", err);
		error(res, 'Failed to retrieve user profile', 500);
	}
});

module.exports = router;

