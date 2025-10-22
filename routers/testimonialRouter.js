const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const Testimonial = require("../models/Testimonial");

// Submit testimonial
router.post("/testimonial/submit", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const { rating, comment } = req.body;

		// Check if user already submitted a testimonial
		const existing = await Testimonial.findOne({ user: req.user._id });
		if (existing) {
			req.flash("error_msg", "You have already submitted a testimonial");
			return res.redirect("/about");
		}

		const testimonial = new Testimonial({
			user: req.user._id,
			userName: req.user.Name1,
			rating: parseInt(rating),
			comment,
		});

		await testimonial.save();

		req.flash("success_msg", "Thank you for your feedback! It will be reviewed and published soon.");
		res.redirect("/about");
	} catch (error) {
		console.error("Testimonial submission error:", error);
		req.flash("error_msg", "Error submitting testimonial");
		res.redirect("/about");
	}
});

// Get all approved testimonials
router.get("/testimonials", async (req, res) => {
	try {
		const testimonials = await Testimonial.find({ approved: true })
			.sort({ createdAt: -1 })
			.limit(20);

		res.json(testimonials);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error loading testimonials" });
	}
});

module.exports = router;

