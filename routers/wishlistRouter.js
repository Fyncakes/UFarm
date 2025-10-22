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
			model: 'Upload',
			populate: { path: 'owner', model: 'Registration' }
		});

		if (!wishlist) {
			wishlist = { products: [] };
		}

		res.render("wishlist", {
			wishlist: wishlist.products || [],
		});
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading wishlist");
		res.redirect("/");
	}
});

// POST Add to Wishlist
router.post("/wishlist/add", ensureAuthenticated, async (req, res) => {
	try {
		const { productId } = req.body;

		// Check if product exists
		const product = await Upload.findById(productId);
		if (!product) {
			req.flash("error_msg", "Product not found");
			return res.redirect("/product");
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
			(item) => item.product.toString() === productId
		);

		if (exists) {
			req.flash("error_msg", "Product already in wishlist");
			return res.redirect("/wishlist");
		}

		// Add product to wishlist
		wishlist.products.push({ product: productId });
		await wishlist.save();

		req.flash("success_msg", "Product added to wishlist!");
		res.redirect("/wishlist");
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error adding to wishlist");
		res.redirect("/product");
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

