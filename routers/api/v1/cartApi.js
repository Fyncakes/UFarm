const express = require("express");
const router = express.Router();
const Cart = require("../../../models/Cart");
const Upload = require("../../../models/Upload");
const { success, error, notFound, validationError } = require("../../../middleware/apiResponse");
const apiAuth = require("../../../middleware/apiAuth");

/**
 * @route   GET /api/v1/cart
 * @desc    Get user's shopping cart
 * @access  Private
 */
router.get("/", apiAuth, async (req, res) => {
	try {
		let cart = await Cart.findOne({ user: req.user._id })
			.populate('items.product', 'productName price image status quantity');
		
		if (!cart) {
			cart = new Cart({
				user: req.user._id,
				items: [],
				totalPrice: 0,
				totalItems: 0
			});
			await cart.save();
		}
		
		success(res, { cart }, 'Cart retrieved successfully');
	} catch (err) {
		console.error("API Get cart error:", err);
		error(res, 'Failed to retrieve cart', 500);
	}
});

/**
 * @route   POST /api/v1/cart/add
 * @desc    Add product to cart
 * @access  Private
 */
router.post("/add", apiAuth, async (req, res) => {
	try {
		const { productId, quantity = 1 } = req.body;
		
		if (!productId) {
			return validationError(res, {
				productId: 'Product ID is required'
			});
		}
		
		const product = await Upload.findById(productId).populate('owner');
		
		if (!product) {
			return notFound(res, 'Product');
		}
		
		if (product.status !== 'approved') {
			return error(res, 'Product is not available for purchase', 400);
		}
		
		if (product.quantity < quantity) {
			return error(res, 'Insufficient quantity available', 400);
		}
		
		let cart = await Cart.findOne({ user: req.user._id });
		
		if (!cart) {
			cart = new Cart({
				user: req.user._id,
				items: []
			});
		}
		
		// Check if product already in cart
		const existingItem = cart.items.find(
			item => item.product.toString() === productId
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
				seller: product.owner._id,
				seller_name: product.owner_name
			});
		}
		
		cart.calculateTotals();
		await cart.save();
		
		const updatedCart = await Cart.findById(cart._id)
			.populate('items.product', 'productName price image status');
		
		success(res, { cart: updatedCart }, 'Product added to cart successfully');
	} catch (err) {
		console.error("API Add to cart error:", err);
		error(res, 'Failed to add product to cart', 500);
	}
});

/**
 * @route   PUT /api/v1/cart/update/:itemId
 * @desc    Update cart item quantity
 * @access  Private
 */
router.put("/update/:itemId", apiAuth, async (req, res) => {
	try {
		const { quantity } = req.body;
		
		if (!quantity || quantity < 1) {
			return validationError(res, {
				quantity: 'Quantity must be at least 1'
			});
		}
		
		const cart = await Cart.findOne({ user: req.user._id });
		
		if (!cart) {
			return notFound(res, 'Cart');
		}
		
		const item = cart.items.id(req.params.itemId);
		if (!item) {
			return notFound(res, 'Cart item');
		}
		
		// Check product availability
		const product = await Upload.findById(item.product);
		if (product.quantity < quantity) {
			return error(res, 'Insufficient quantity available', 400);
		}
		
		item.quantity = parseInt(quantity);
		cart.calculateTotals();
		await cart.save();
		
		const updatedCart = await Cart.findById(cart._id)
			.populate('items.product', 'productName price image');
		
		success(res, { cart: updatedCart }, 'Cart updated successfully');
	} catch (err) {
		console.error("API Update cart error:", err);
		error(res, 'Failed to update cart', 500);
	}
});

/**
 * @route   DELETE /api/v1/cart/remove/:itemId
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete("/remove/:itemId", apiAuth, async (req, res) => {
	try {
		const cart = await Cart.findOne({ user: req.user._id });
		
		if (!cart) {
			return notFound(res, 'Cart');
		}
		
		cart.items.pull(req.params.itemId);
		cart.calculateTotals();
		await cart.save();
		
		success(res, { cart }, 'Item removed from cart successfully');
	} catch (err) {
		console.error("API Remove from cart error:", err);
		error(res, 'Failed to remove item from cart', 500);
	}
});

/**
 * @route   DELETE /api/v1/cart/clear
 * @desc    Clear entire cart
 * @access  Private
 */
router.delete("/clear", apiAuth, async (req, res) => {
	try {
		const cart = await Cart.findOne({ user: req.user._id });
		
		if (cart) {
			cart.items = [];
			cart.totalPrice = 0;
			cart.totalItems = 0;
			await cart.save();
		}
		
		success(res, { cart }, 'Cart cleared successfully');
	} catch (err) {
		console.error("API Clear cart error:", err);
		error(res, 'Failed to clear cart', 500);
	}
});

module.exports = router;

