const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const Registration = require("../models/User");
const Product = require("../models/Product");
const Upload = require("../models/Upload");
const Order = require("../models/Order");
const Category = require("../models/Category");
const { sendEmail, emailTemplates } = require("../config/email");

// Agriculture Officer Dashboard
router.get("/OA", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		// Get all Farmer One agents
		const farmerOneAgents = await Registration.find({ role: "Farmer one" });
		
		// Calculate performance for each agent
		const agentPerformance = await Promise.all(
			farmerOneAgents.map(async (agent) => {
				// Get farmers registered by this agent
				const registeredFarmers = await Registration.find({
					registeredBy: agent._id,
					role: { $in: ["Urban farmer", "user"] }
				});
				
				const farmerIds = registeredFarmers.map(f => f._id);
				
				// Get products from this agent's farmers
				const products = await Upload.find({ owner: { $in: farmerIds } });
				
				// Calculate statistics
				const totalFarmers = registeredFarmers.length;
				const activeFarmers = [...new Set(products.map(p => p.owner.toString()))].length;
				const totalProducts = products.length;
				const pendingProducts = products.filter(p => p.status === 'pending').length;
				const approvedProducts = products.filter(p => p.status === 'approved').length;
				const rejectedProducts = products.filter(p => p.status === 'rejected').length;
				
				return {
					agent: agent.Name1,
					agentId: agent._id,
					district: agent.Ward1 || 'Not specified',
					totalFarmers,
					activeFarmers,
					totalProducts,
					pendingProducts,
					approvedProducts,
					rejectedProducts
				};
			})
		);

		// Get overall statistics
		const totalFarmers = await Registration.countDocuments({
			role: { $in: ["Farmer one", "Urban farmer"] },
		});
		const totalBuyers = await Registration.countDocuments({ role: "user" });
		const totalProducts = await Upload.countDocuments();
		const pendingProducts = await Upload.countDocuments({ status: "pending" });
		const approvedProducts = await Upload.countDocuments({ status: "approved" });
		const totalOrders = await Order.countDocuments();
		const totalCategories = await Category.countDocuments({ active: true });
		const totalAgents = farmerOneAgents.length;

		// Get recent farmers
		const recentFarmers = await Registration.find({
			role: { $in: ["Farmer one", "Urban farmer"] },
		})
			.populate('registeredBy', 'Name1')
			.sort({ createdAt: -1 })
			.limit(5);

		// Get pending products
		const pendingProductsList = await Upload.find({ status: "pending" })
			.populate("owner")
			.sort({ createdAt: -1 })
			.limit(10);

		// Get all categories
		const categories = await Category.find({ active: true });

		// Get recent registrations
		const recentUsers = await Registration.find()
			.sort({ createdAt: -1 })
			.limit(10);

		res.render("agricDashboard", {
			stats: {
				totalFarmers,
				totalBuyers,
				totalProducts,
				pendingProducts,
				approvedProducts,
				totalOrders,
				totalCategories,
				totalAgents
			},
			agentPerformance,
			recentFarmers,
			pendingProductsList,
			categories,
			recentUsers
		});
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading dashboard");
		res.redirect("/");
	}
});

// View all farmers
router.get("/OA/farmers", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		const farmers = await Registration.find({
			role: { $in: ["Farmer one", "Urban farmer"] },
		}).sort({ createdAt: -1 });

		res.render("farmersList", { farmers });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading farmers");
		res.redirect("/OA");
	}
});

// View all buyers
router.get("/OA/buyers", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		const buyers = await Registration.find({ role: "user" }).sort({ createdAt: -1 });

		res.render("buyersList", { buyers });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading buyers");
		res.redirect("/OA");
	}
});

// View all products for approval
router.get("/OA/products", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		const products = await Product.find().populate("owner category").sort({ createdAt: -1 });

		res.render("productsManagement", { products });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading products");
		res.redirect("/OA");
	}
});

// Verify farmer
router.post("/OA/farmer/:id/verify", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		await Registration.findByIdAndUpdate(req.params.id, { verified: true });
		req.flash("success_msg", "Farmer verified successfully");
		res.redirect("/OA/farmers");
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error verifying farmer");
		res.redirect("/OA/farmers");
	}
});

// Deactivate user
router.post("/OA/user/:id/deactivate", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		const user = await Registration.findById(req.params.id);
		user.active = !user.active;
		await user.save();

		req.flash("success_msg", `User ${user.active ? "activated" : "deactivated"} successfully`);
		res.redirect("back");
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error updating user status");
		res.redirect("back");
	}
});

// View all farmers
router.get("/OA/farmers", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		const farmers = await Registration.find({
			role: { $in: ["Farmer one", "Urban farmer"] },
		}).populate('registeredBy', 'Name1').sort({ createdAt: -1 });

		res.render("agricFarmers", { farmers });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading farmers");
		res.redirect("/OA");
	}
});

// View all buyers
router.get("/OA/buyers", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		const buyers = await Registration.find({ role: "user" }).sort({ createdAt: -1 });

		res.render("agricBuyers", { buyers });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading buyers");
		res.redirect("/OA");
	}
});

// View all products
router.get("/OA/products", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		const products = await Upload.find().populate("owner").sort({ createdAt: -1 });

		res.render("agricProducts", { products });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading products");
		res.redirect("/OA");
	}
});

// Approve product
router.post("/OA/approve-product", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		const product = await Upload.findById(req.body.productId);
		if (!product) {
			req.flash("error_msg", "Product not found");
			return res.redirect("/OA/products");
		}

		product.status = "approved";
		await product.save();

		req.flash("success_msg", "Product approved successfully");
		res.redirect("/OA/products");
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error approving product");
		res.redirect("/OA/products");
	}
});

// Reject product
router.get("/OA/reject-product/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}

		const product = await Upload.findById(req.params.id);
		if (!product) {
			req.flash("error_msg", "Product not found");
			return res.redirect("/OA/products");
		}

		product.status = "rejected";
		await product.save();

		req.flash("success_msg", "Product rejected");
		res.redirect("/OA/products");
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error rejecting product");
		res.redirect("/OA/products");
	}
});

// Register Farmer One Agent (Agriculture Officer only)
router.post("/OA/register-agent", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		// Security: Only Agriculture Officers can register agents
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/");
		}
		
		// Check if username already exists
		const existingUser = await Registration.findOne({ Name1: req.body.Name1 });
		if (existingUser) {
			req.flash("error_msg", "Username already exists. Please choose a different name.");
			return res.redirect("/OA");
		}
		
		// Create new Farmer One agent
		const agent = new Registration(req.body);
		agent.role = "Farmer one"; // Ensure role is set
		
		console.log(`Agriculture Officer ${req.user.Name1} registering Farmer One Agent:`, req.body.Name1);
		
		await Registration.register(agent, req.body.password, async (error) => {
			if (error) {
				console.error("Agent registration error:", error);
				if (error.name === 'UserExistsError') {
					req.flash("error_msg", "Username already exists. Please choose a different name.");
				} else {
					req.flash("error_msg", "Registration failed. Please try again.");
				}
				return res.redirect("/OA");
			}
			
			// Send email to new agent
			if (req.body.email) {
				const agentEmail = emailTemplates.farmerOneRegistration(
					req.body.Name1,
					req.user.Name1
				);
				await sendEmail(req.body.email, agentEmail);
			}

			// Send notification to Agriculture Officer
			if (req.user.email) {
				const officerEmail = emailTemplates.officerAgentNotification(
					req.body.Name1,
					req.user.Name1
				);
				await sendEmail(req.user.email, officerEmail);
			}
			
			req.flash("success_msg", `Farmer One Agent "${req.body.Name1}" registered successfully!`);
			res.redirect("/OA");
		});
	} catch (error) {
		console.error("Agent registration error:", error);
		if (error.code === 11000) {
			req.flash("error_msg", "Username already exists. Please choose a different name.");
		} else {
			req.flash("error_msg", "Registration failed. Please check your information.");
		}
		res.redirect("/OA");
	}
});

module.exports = router;
