const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const Cart = require("../models/Cart");
const Upload = require("../models/Upload");

// View cart
router.get("/cart", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
		
		if (!cart) {
			cart = new Cart({
				user: req.user._id,
				items: [],
				totalPrice: 0,
				totalItems: 0,
			});
			await cart.save();
		}

		res.render("cart", { cart });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading cart");
		res.redirect("/product");
	}
});

// Add to cart
router.post("/cart/add", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const { productId, quantity } = req.body;
		const product = await Upload.findById(productId).populate("owner");

		if (!product) {
			req.flash("error_msg", "Product not found");
			return res.redirect("/product");
		}

		// Check if product is approved
		if (product.status !== 'approved') {
			req.flash("error_msg", "This product is not available for purchase");
			return res.redirect("/product");
		}

		if (product.quantity < quantity) {
			req.flash("error_msg", "Insufficient quantity available");
			return res.redirect("/product");
		}

		let cart = await Cart.findOne({ user: req.user._id });

		if (!cart) {
			cart = new Cart({
				user: req.user._id,
				items: [],
			});
		}

		// Check if product already in cart
		const existingItem = cart.items.find(
			(item) => item.product.toString() === productId
		);

		if (existingItem) {
			existingItem.quantity += parseInt(quantity);
		} else {
			cart.items.push({
				product: product._id,
				productName: product.productName,
				price: product.price,
				quantity: parseInt(quantity),
				image: product.image,
				seller: product.owner,
				seller_name: product.owner_name,
			});
		}

		cart.calculateTotals();
		await cart.save();

		req.flash("success_msg", "Product added to cart successfully!");
		res.redirect("/cart");
	} catch (error) {
		console.error("Cart add error:", error);
		req.flash("error_msg", "Error adding to cart");
		res.redirect("/product");
	}
});

// Update cart item quantity
router.post("/cart/update/:itemId", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const { quantity } = req.body;
		const cart = await Cart.findOne({ user: req.user._id });

		if (!cart) {
			req.flash("error_msg", "Cart not found");
			return res.redirect("/cart");
		}

		const item = cart.items.id(req.params.itemId);
		if (item) {
			item.quantity = parseInt(quantity);
			cart.calculateTotals();
			await cart.save();
			req.flash("success_msg", "Cart updated");
		}

		res.redirect("/cart");
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error updating cart");
		res.redirect("/cart");
	}
});

// Remove from cart
router.post("/cart/remove/:itemId", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const cart = await Cart.findOne({ user: req.user._id });

		if (!cart) {
			req.flash("error_msg", "Cart not found");
			return res.redirect("/cart");
		}

		cart.items.pull(req.params.itemId);
		cart.calculateTotals();
		await cart.save();

		req.flash("success_msg", "Item removed from cart");
		res.redirect("/cart");
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error removing item");
		res.redirect("/cart");
	}
});

// Clear cart
router.post("/cart/clear", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const cart = await Cart.findOne({ user: req.user._id });

		if (cart) {
			cart.items = [];
			cart.totalPrice = 0;
			cart.totalItems = 0;
			await cart.save();
		}

		req.flash("success_msg", "Cart cleared");
		res.redirect("/cart");
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error clearing cart");
		res.redirect("/cart");
	}
});

module.exports = router;

