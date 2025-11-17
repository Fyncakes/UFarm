const express = require("express");
const router = express.Router();
const Upload = require("../models/Upload");
const Wishlist = require("../models/Wishlist");

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error_msg", "Please log in to view your wishlist");
	res.redirect("/login");
}

// GET Wishlist Page
router.get("/wishlist", ensureAuthenticated, async (req, res) => {
	try {
		let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
			path: 'products.product',
			model: 'Upload'
		});

		if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
			return res.render("wishlist", {
				wishlist: [],
				user: req.user
			});
		}

		// Filter out any null products (deleted products) and only show approved products
		const validItems = wishlist.products.filter(item => 
			item.product !== null && 
			item.product !== undefined &&
			item.product.status === 'approved'
		);

		console.log(`Wishlist for user ${req.user.Name1}: ${validItems.length} items`);

		res.render("wishlist", {
			wishlist: validItems,
			user: req.user
		});
	} catch (error) {
		console.error("Wishlist error:", error);
		req.flash("error_msg", "Error loading wishlist");
		res.render("wishlist", {
			wishlist: [],
			user: req.user
		});
	}
});

// POST Add to Wishlist
router.post("/wishlist/add", ensureAuthenticated, async (req, res) => {
	try {
		const { productId } = req.body;

		if (!productId) {
			req.flash("error_msg", "Product ID is required");
			return res.redirect("back");
		}

		// Check if product exists
		const product = await Upload.findById(productId);
		if (!product) {
			req.flash("error_msg", "Product not found");
			return res.redirect("back");
		}

		// Find or create wishlist
		let wishlist = await Wishlist.findOne({ user: req.user._id });
		if (!wishlist) {
			wishlist = new Wishlist({
				user: req.user._id,
				products: [],
			});
		}

		// Check if product already in wishlist
		const exists = wishlist.products.some(
			(item) => item.product && item.product.toString() === productId.toString()
		);

		if (exists) {
			req.flash("info_msg", "Product already in wishlist");
			return res.redirect("back");
		}

		// Add product to wishlist
		wishlist.products.push({ product: productId });
		await wishlist.save();

		req.flash("success_msg", "Product added to wishlist!");
		res.redirect("back");
	} catch (error) {
		console.error("Add to wishlist error:", error);
		req.flash("error_msg", "Error adding to wishlist");
		res.redirect("back");
	}
});

// POST Remove from Wishlist
router.post("/wishlist/remove/:productId", ensureAuthenticated, async (req, res) => {
	try {
		const { productId } = req.params;

		const wishlist = await Wishlist.findOne({ user: req.user._id });
		if (!wishlist) {
			req.flash("error_msg", "Wishlist not found");
			return res.redirect("/wishlist");
		}

		// Remove product from wishlist
		wishlist.products = wishlist.products.filter(
			(item) => item.product.toString() !== productId
		);
		await wishlist.save();

		req.flash("success_msg", "Product removed from wishlist");
		res.redirect("/wishlist");
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error removing from wishlist");
		res.redirect("/wishlist");
	}
});

module.exports = router;

