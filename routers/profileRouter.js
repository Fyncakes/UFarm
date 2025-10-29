const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { uploadProfile } = require("../config/cloudinary");

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error_msg", "Please log in to view this page");
	res.redirect("/login");
}

// GET Profile Page
router.get("/profile", ensureAuthenticated, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		res.render("profile", {
			user: user,
			success_msg: req.flash("success_msg"),
			error_msg: req.flash("error_msg"),
		});
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading profile");
		res.redirect("/");
	}
});

// POST Update Profile
router.post("/profile/update", ensureAuthenticated, uploadProfile.single("profileImage"), async (req, res) => {
	try {
		console.log("Profile update request:", req.body);
		
		const updateData = {
			email: req.body.email,
			phonenumber: req.body.phonenumber,
			Gender1: req.body.Gender1,
			bio: req.body.bio,
			address: req.body.address,
			district: req.body.district,
			village: req.body.village,
			Ward1: req.body.Ward1,
			Nin1: req.body.Nin1,
		};

		// Add farmer-specific fields if applicable
		if (req.user.role === "Urban farmer" || req.user.role === "Farmer one") {
			if (req.body.farmSize) updateData.farmSize = req.body.farmSize;
			if (req.body.farmType) updateData.farmType = req.body.farmType;
			if (req.body.farmLocation) updateData.farmLocation = req.body.farmLocation;
		}

		// Add profile image if uploaded (Cloudinary URL)
		if (req.file) {
			updateData.profileImage = req.file.path;
		}

		// Remove undefined values
		Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

		await User.findByIdAndUpdate(req.user._id, updateData, { new: true });

		console.log("Profile updated successfully for user:", req.user.Name1);
		req.flash("success_msg", "Profile updated successfully!");
		res.redirect("/profile");
	} catch (error) {
		console.error("Profile update error:", error);
		req.flash("error_msg", "Error updating profile: " + error.message);
		res.redirect("/profile");
	}
});

// POST Change Password
router.post("/profile/change-password", ensureAuthenticated, async (req, res) => {
	try {
		const { currentPassword, newPassword, confirmPassword } = req.body;

		if (newPassword !== confirmPassword) {
			req.flash("error_msg", "New passwords do not match");
			return res.redirect("/profile");
		}

		const user = await User.findById(req.user._id);

		// Verify current password
		user.changePassword(currentPassword, newPassword, function (err) {
			if (err) {
				req.flash("error_msg", "Current password is incorrect");
				return res.redirect("/profile");
			}

			req.flash("success_msg", "Password changed successfully!");
			res.redirect("/profile");
		});
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error changing password");
		res.redirect("/profile");
	}
});

module.exports = router;

