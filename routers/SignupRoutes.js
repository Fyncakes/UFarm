const express = require("express");
const router = express.Router();

//.....................importing mode.................
const Registration = require("../models/User");

router.get("/Register", (req, res) => {
	res.render("Signup");
});

router.post("/Register", async (req, res) => {
	console.log(req.body);
	try {
		// SECURITY: Block direct registration of restricted roles
		const restrictedRoles = ["Urban farmer", "Farmer one", "Agriculture Officer"];
		if (restrictedRoles.includes(req.body.role)) {
			req.flash("error_msg", "This role cannot be registered directly. Please see registration requirements.");
			return res.redirect("/join-requirements");
		}
		
		// Only allow "user" (buyer/customer) role for public registration
		if (req.body.role !== "user") {
			req.flash("error_msg", "Invalid account type selected.");
			return res.redirect("/Register");
		}
		
		// Check if username (Name1) already exists
		const existingUser = await Registration.findOne({ Name1: req.body.Name1 });
		if (existingUser) {
			req.flash("error_msg", "Username already exists. Please choose a different name.");
			return res.redirect("/Register");
		}
		
		const user = new Registration(req.body);
		console.log('Registering user (buyer):', req.body.Name1);
		console.log(user);

		// Register user with passport-local-mongoose
		await Registration.register(user, req.body.password, (error) => {
			if (error) {
				console.error(error);
				if (error.name === 'UserExistsError') {
					req.flash("error_msg", "Username already exists. Please choose a different name.");
				} else {
					req.flash("error_msg", "Registration failed. Please try again.");
				}
				return res.redirect("/Register");
			}
			req.flash("success_msg", `Registration successful! Welcome to Ufarm. Please login with your username: ${req.body.Name1}`);
			res.redirect("/login");
		});
	} catch (error) {
		if (error.code === 11000) {
			req.flash("error_msg", "Username already exists. Please choose a different name.");
		} else {
			req.flash("error_msg", "Registration failed. Please check your information.");
		}
		console.log(error);
		res.redirect("/Register");
	}
});

module.exports = router;
