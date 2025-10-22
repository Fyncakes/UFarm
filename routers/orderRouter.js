const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Upload = require("../models/Upload"); // Changed from Product to Upload
const Registration = require("../models/User");
const { sendEmail, emailTemplates } = require("../config/email");

// Checkout page
router.get("/checkout", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

		if (!cart || cart.items.length === 0) {
			req.flash("error_msg", "Your cart is empty");
			return res.redirect("/cart");
		}

		res.render("checkout", { cart });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading checkout");
		res.redirect("/cart");
	}
});

// Place order
router.post("/order/place", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const { deliveryAddress, deliveryLocation, paymentMethod, notes } = req.body;
		const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

		if (!cart || cart.items.length === 0) {
			req.flash("error_msg", "Your cart is empty");
			return res.redirect("/cart");
		}

		// Validate product availability
		for (const item of cart.items) {
			const product = await Upload.findById(item.product._id);
			if (!product || product.quantity < item.quantity) {
				req.flash("error_msg", `${item.productName} is not available in requested quantity`);
				return res.redirect("/cart");
			}
		}

		// Create order
		const order = new Order({
			buyer: req.user._id,
			buyer_name: req.user.Name1,
			buyer_phone: req.user.phonenumber,
			items: cart.items.map((item) => ({
				product: item.product._id,
				productName: item.productName,
				price: item.price,
				quantity: item.quantity,
				image: item.image,
				seller: item.seller,
				seller_name: item.seller_name,
			})),
			totalPrice: cart.totalPrice,
			deliveryAddress,
			deliveryLocation,
			paymentMethod,
			notes,
		});

	await order.save();

	// Update product quantities
	for (const item of cart.items) {
		await Upload.findByIdAndUpdate(item.product._id, {
			$inc: { quantity: -item.quantity },
		});
	}

	// Clear cart
	cart.items = [];
	cart.totalPrice = 0;
	cart.totalItems = 0;
	await cart.save();

	// Send email notifications
	try {
		// Email to customer
		if (req.user.email) {
			const itemsList = order.items.map(item => 
				`<div class="item"><strong>${item.productName}</strong> x ${item.quantity} - UGX ${(item.price * item.quantity).toLocaleString()}</div>`
			).join('');
			
			const customerEmail = emailTemplates.customerOrderConfirmation(
				req.user.Name1,
				order._id.toString().slice(-8),
				itemsList,
				order.totalPrice
			);
			await sendEmail(req.user.email, customerEmail);
		}

		// Email to farmers for each product
		const uniqueSellers = [...new Set(order.items.map(item => item.seller.toString()))];
		for (const sellerId of uniqueSellers) {
			const seller = await Registration.findById(sellerId);
			if (seller && seller.email) {
				const sellerItems = order.items.filter(item => item.seller.toString() === sellerId);
				const firstItem = sellerItems[0];
				const totalAmount = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
				const quantity = sellerItems.reduce((sum, item) => sum + item.quantity, 0);
				
				const farmerEmail = emailTemplates.farmerOrderNotification(
					seller.Name1,
					order._id.toString().slice(-8),
					sellerItems.length > 1 ? `${firstItem.productName} and ${sellerItems.length - 1} other(s)` : firstItem.productName,
					quantity,
					totalAmount
				);
				await sendEmail(seller.email, farmerEmail);
			}
		}
	} catch (emailError) {
		console.error("Error sending order emails:", emailError);
		// Don't fail the order if email fails
	}

	req.flash("success_msg", "Order placed successfully");
	res.redirect(`/order/${order._id}`);
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error placing order");
		res.redirect("/checkout");
	}
});

// View single order
router.get("/order/:id", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate("buyer")
			.populate("items.product")
			.populate("items.seller");

		if (!order) {
			req.flash("error_msg", "Order not found");
			return res.redirect("/orders");
		}

		// Check if user has permission to view this order
		if (
			order.buyer._id.toString() !== req.user._id.toString() &&
			!order.items.some((item) => item.seller.toString() === req.user._id.toString()) &&
			req.user.role !== "Agriculture Officer"
		) {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/orders");
		}

		res.render("orderDetail", { order });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading order");
		res.redirect("/orders");
	}
});

// View all orders (for buyer)
router.get("/orders", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		let orders;

		if (req.user.role === "user" || req.user.role === "buyer") {
			// Buyer's orders
			orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
		} else if (req.user.role === "Farmer one" || req.user.role === "Urban farmer" || req.user.role === "seller") {
			// Seller's orders
			orders = await Order.find({ "items.seller": req.user._id }).sort({ createdAt: -1 });
		} else if (req.user.role === "Agriculture Officer") {
			// All orders for agriculture officer
			orders = await Order.find().sort({ createdAt: -1 });
		} else {
			orders = [];
		}

		res.render("orders", { orders });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading orders");
		res.redirect("/");
	}
});

// Update order status (for sellers and agriculture officers)
router.post("/order/:id/update", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const { orderStatus, paymentStatus, deliveryDate } = req.body;
		const order = await Order.findById(req.params.id);

		if (!order) {
			req.flash("error_msg", "Order not found");
			return res.redirect("/orders");
		}

		// Check permissions
		const isSeller = order.items.some(
			(item) => item.seller.toString() === req.user._id.toString()
		);
		const isAdmin = req.user.role === "Agriculture Officer";

		if (!isSeller && !isAdmin) {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/orders");
		}

		if (orderStatus) order.orderStatus = orderStatus;
		if (paymentStatus) order.paymentStatus = paymentStatus;
		if (deliveryDate) order.deliveryDate = deliveryDate;

		await order.save();

		req.flash("success_msg", "Order updated successfully");
		res.redirect(`/order/${order._id}`);
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error updating order");
		res.redirect("/orders");
	}
});

// Cancel order
router.post("/order/:id/cancel", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const { cancelReason } = req.body;
		const order = await Order.findById(req.params.id);

		if (!order) {
			req.flash("error_msg", "Order not found");
			return res.redirect("/orders");
		}

		// Only buyer can cancel before confirmation
		if (
			order.buyer.toString() !== req.user._id.toString() &&
			req.user.role !== "Agriculture Officer"
		) {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/orders");
		}

		if (["delivered", "cancelled"].includes(order.orderStatus)) {
			req.flash("error_msg", "Cannot cancel this order");
			return res.redirect(`/order/${order._id}`);
		}

		order.orderStatus = "cancelled";
		order.cancelReason = cancelReason;
		await order.save();

		// Restore product quantities
		for (const item of order.items) {
			await Upload.findByIdAndUpdate(item.product, {
				$inc: { quantity: item.quantity },
			});
		}

		req.flash("success_msg", "Order cancelled successfully");
		res.redirect(`/order/${order._id}`);
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error cancelling order");
		res.redirect("/orders");
	}
});

module.exports = router;

