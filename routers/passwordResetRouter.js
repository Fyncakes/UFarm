const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/User");
const { sendEmail, emailTemplates } = require("../config/email");
require("dotenv").config();

// Forgot Password Page
router.get("/forgot-password", (req, res) => {
	res.render("forgotPassword");
});

// Handle Forgot Password Request
router.post("/forgot-password", async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			req.flash("error_msg", "Please enter your email address");
			return res.redirect("/forgot-password");
		}

		// Find user by email
		const user = await User.findOne({ email: email.toLowerCase() });

		if (!user) {
			// Don't reveal if email exists or not (security best practice)
			req.flash("success_msg", "If an account with that email exists, we've sent password reset instructions.");
			return res.redirect("/forgot-password");
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

		// Save token to user
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = new Date(resetTokenExpiry);
		await user.save();

		// Create reset link
		const resetLink = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;

		// Send response immediately (don't wait for email)
		req.flash("success_msg", "If an account with that email exists, we've sent password reset instructions. Please check your inbox.");
		res.redirect("/forgot-password");

		// Send email asynchronously (non-blocking)
		// Don't await - let it run in background
		const emailTemplate = emailTemplates.passwordReset(user.Name1, resetLink);
		sendEmail(user.email, emailTemplate)
			.then((emailResult) => {
				if (emailResult.success) {
					console.log("Password reset email sent successfully to:", user.email);
				} else {
					console.error("Failed to send password reset email:", emailResult.error || emailResult.message);
				}
			})
			.catch((error) => {
				console.error("Error sending password reset email:", error);
			});
	} catch (error) {
		console.error("Forgot password error:", error);
		req.flash("error_msg", "An error occurred. Please try again later.");
		res.redirect("/forgot-password");
	}
});

// Reset Password Page
router.get("/reset-password/:token", async (req, res) => {
	try {
		const { token } = req.params;

		// Find user with valid token
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() }, // Token not expired
		});

		if (!user) {
			req.flash("error_msg", "Password reset link is invalid or has expired. Please request a new one.");
			return res.redirect("/forgot-password");
		}

		res.render("resetPassword", { token });
	} catch (error) {
		console.error("Reset password page error:", error);
		req.flash("error_msg", "An error occurred. Please try again.");
		res.redirect("/forgot-password");
	}
});

// Handle Password Reset
router.post("/reset-password/:token", async (req, res) => {
	try {
		const { token } = req.params;
		const { password, confirmPassword } = req.body;

		// Validation
		if (!password || !confirmPassword) {
			req.flash("error_msg", "Please fill in all fields");
			return res.redirect(`/reset-password/${token}`);
		}

		if (password.length < 6) {
			req.flash("error_msg", "Password must be at least 6 characters long");
			return res.redirect(`/reset-password/${token}`);
		}

		if (password !== confirmPassword) {
			req.flash("error_msg", "Passwords do not match");
			return res.redirect(`/reset-password/${token}`);
		}

		// Find user with valid token
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		});

		if (!user) {
			req.flash("error_msg", "Password reset link is invalid or has expired. Please request a new one.");
			return res.redirect("/forgot-password");
		}

		// Set new password using passport-local-mongoose method
		await new Promise((resolve, reject) => {
			user.setPassword(password, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});

		// Clear reset token
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		// Send response immediately
		req.flash("success_msg", "Your password has been reset successfully! You can now login with your new password.");
		res.redirect("/login");

		// Send confirmation email asynchronously (non-blocking)
		const emailTemplate = emailTemplates.passwordResetSuccess(user.Name1);
		sendEmail(user.email, emailTemplate)
			.then((emailResult) => {
				if (emailResult.success) {
					console.log("Password reset success email sent to:", user.email);
				} else {
					console.error("Failed to send password reset success email:", emailResult.error || emailResult.message);
				}
			})
			.catch((error) => {
				console.error("Error sending password reset success email:", error);
			});
	} catch (error) {
		console.error("Password reset error:", error);
		req.flash("error_msg", "An error occurred while resetting your password. Please try again.");
		res.redirect(`/reset-password/${req.params.token}`);
	}
});

module.exports = router;

