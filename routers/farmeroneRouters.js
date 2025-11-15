const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const connectEnsureLogin = require("connect-ensure-login");

const Registration = require("../models/User");
const UploadProductModel = require("../models/Upload");
const { sendEmail, emailTemplates } = require("../config/email");

router.get("/FO", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		// CRITICAL: Get only farmers registered by THIS Farmer One agent
		const myFarmers = await Registration.find({ 
			registeredBy: req.user._id,
			role: { $in: ['Urban farmer', 'user'] } 
		}).sort({ createdAt: -1 });
		
		// Get farmer IDs for product filtering
		const myFarmerIds = myFarmers.map(f => f._id);
		
		// Get only products from THIS agent's farmers
		const ufProduce = await UploadProductModel.find({ 
			owner: { $in: myFarmerIds } 
		}).populate('owner');
		
		// Calculate statistics for THIS agent's farmers only
		const totalProducts = ufProduce.length;
		const pendingProducts = ufProduce.filter(p => p.status === 'pending').length;
		const approvedProducts = ufProduce.filter(p => p.status === 'approved').length;
		const rejectedProducts = ufProduce.filter(p => p.status === 'rejected').length;
		
		// Get active farmers (those who have uploaded products)
		const activeFarmerIds = [...new Set(ufProduce.map(p => p.owner._id.toString()))];
		const activeFarmersCount = activeFarmerIds.length;
		
		console.log(`Farmer One Agent ${req.user.Name1} - My Farmers: ${myFarmers.length}, Products: ${totalProducts}`);
		
		res.render("farmerone", { 
			ufproduces: ufProduce,
			stats: {
				totalProducts,
				pendingProducts,
				approvedProducts,
				rejectedProducts,
				totalFarmers: myFarmers.length,
				activeFarmers: activeFarmersCount
			},
			registeredFarmers: myFarmers,
			agentName: req.user.Name1
		});
	} catch (error) {
		console.error("Error loading Farmer One dashboard:", error);
		req.flash("error_msg", "Error loading dashboard");
		res.redirect("/");
	}
});

router.post("/update_urbanfarmer", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const produceById = await UploadProductModel.findById({ _id: req.body.urbanfarmerID });
		
		if (!produceById) {
			req.flash("error_msg", "Product not found");
			return res.redirect("/FO");
		}

		produceById.status = "approved";
		await produceById.save();

		req.flash("success_msg", "Product approved successfully");
		res.redirect("/FO");
	} catch (error) {
		console.error("Error approving product:", error);
		req.flash("error_msg", "Error approving product");
		res.redirect("/FO");
	}
});

router.post("/FO", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		// Check if username already exists
		const existingUser = await Registration.findOne({ Name1: req.body.Name1 });
		if (existingUser) {
			req.flash("error_msg", "Username already exists. Please choose a different name.");
			return res.redirect("/FO");
		}
		
		// Add tracking: WHO registered this farmer
		req.body.registeredBy = req.user._id;
		req.body.registeredByName = req.user.Name1;
		req.body.registrationDate = new Date();
		
		const user = new Registration(req.body);
		console.log(`Farmer One Agent ${req.user.Name1} registering farmer:`, req.body.Name1);
		
	await Registration.register(user, req.body.password, async (error) => {
		if (error) {
			console.error(error);
			if (error.name === 'UserExistsError') {
				req.flash("error_msg", "Username already exists. Please choose a different name.");
			} else {
				req.flash("error_msg", "Registration failed. Please try again.");
			}
			return res.redirect("/FO");
		}
		
		// Send email to newly registered Urban Farmer
		if (req.body.email) {
			const farmerEmail = emailTemplates.urbanFarmerRegistration(
				req.body.Name1,
				req.user.Name1
			);
			await sendEmail(req.body.email, farmerEmail);
		}
		
		req.flash("success_msg", `Farmer "${req.body.Name1}" registered successfully under your account!`);
		res.redirect("/FO");
	});
	} catch (error) {
		console.error("Registration error:", error);
		if (error.code === 11000) {
			req.flash("error_msg", "Username already exists. Please choose a different name.");
		} else {
			req.flash("error_msg", "Registration failed. Please check your information.");
		}
		res.redirect("/FO");
	}
});

// Review Products (Farmer One)
router.get("/FO/review-products", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Farmer one") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		const Upload = require("../models/Upload");
		const Registration = require("../models/User");
		
		// Get farmers registered by this agent
		const myFarmers = await Registration.find({ registeredBy: req.user._id });
		const farmerIds = myFarmers.map(f => f._id);
		
		// Get products from my farmers
		const products = await Upload.find({ owner: { $in: farmerIds } })
			.populate("owner")
			.sort({ createdAt: -1 });
		
		res.render("agricProducts", { products, filter: 'all', isFarmerOne: true });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading products");
		res.redirect("/FO");
	}
});

// My Farmers (Farmer One)
router.get("/FO/my-farmers", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Farmer one") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		const farmers = await Registration.find({ registeredBy: req.user._id })
			.sort({ createdAt: -1 });
		
		res.render("farmersList", { farmers, isFarmerOne: true });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading farmers");
		res.redirect("/FO");
	}
});

// View products with filters (Farmer One)
router.get("/FO/products", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Farmer one") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		const Upload = require("../models/Upload");
		const Registration = require("../models/User");
		
		const filter = req.query.filter || 'all';
		let query = {};
		
		// Get farmers registered by this agent
		const myFarmers = await Registration.find({ registeredBy: req.user._id });
		const farmerIds = myFarmers.map(f => f._id);
		query.owner = { $in: farmerIds };
		
		if (filter === 'pending') {
			query.status = 'pending';
		} else if (filter === 'approved') {
			query.status = 'approved';
		} else if (filter === 'rejected') {
			query.status = 'rejected';
		}
		
		const products = await Upload.find(query)
			.populate("owner")
			.sort({ createdAt: -1 });
		
		res.render("agricProducts", { products, filter, isFarmerOne: true });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading products");
		res.redirect("/FO");
	}
});

module.exports = router;
