const express = require("express");
const router = express.Router();
const Order = require("../../../models/Order");
const Cart = require("../../../models/Cart");
const Upload = require("../../../models/Upload");
const { success, error, notFound, validationError } = require("../../../middleware/apiResponse");
const apiAuth = require("../../../middleware/apiAuth");

/**
 * @route   GET /api/v1/orders
 * @desc    Get user's orders
 * @access  Private
 * @query   page, limit, status
 */
router.get("/", apiAuth, async (req, res) => {
	try {
		const { page = 1, limit = 20, status } = req.query;
		const skip = (parseInt(page) - 1) * parseInt(limit);
		
		let query = { buyer: req.user._id };
		if (status) {
			query.orderStatus = status;
		}
		
		const orders = await Order.find(query)
			.populate('items.product', 'productName image')
			.populate('items.seller', 'Name1 email phonenumber')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit))
			.select('-__v');
		
		const total = await Order.countDocuments(query);
		
		success(res, {
			orders,
			pagination: {
				currentPage: parseInt(page),
				totalPages: Math.ceil(total / parseInt(limit)),
				totalItems: total,
				itemsPerPage: parseInt(limit)
			}
		}, 'Orders retrieved successfully');
	} catch (err) {
		console.error("API Get orders error:", err);
		error(res, 'Failed to retrieve orders', 500);
	}
});

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get single order details
 * @access  Private
 */
router.get("/:id", apiAuth, async (req, res) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate('items.product', 'productName image description')
			.populate('items.seller', 'Name1 email phonenumber')
			.populate('buyer', 'Name1 email phonenumber')
			.select('-__v');
		
		if (!order) {
			return notFound(res, 'Order');
		}
		
		// Check if user owns the order or is a seller
		const isBuyer = order.buyer._id.toString() === req.user._id.toString();
		const isSeller = order.items.some(item => 
			item.seller._id.toString() === req.user._id.toString()
		);
		
		if (!isBuyer && !isSeller && req.user.role !== 'Agriculture Officer') {
			return error(res, 'Unauthorized to view this order', 403);
		}
		
		success(res, { order }, 'Order retrieved successfully');
	} catch (err) {
		if (err.name === 'CastError') {
			return notFound(res, 'Order');
		}
		console.error("API Get order error:", err);
		error(res, 'Failed to retrieve order', 500);
	}
});

/**
 * @route   POST /api/v1/orders
 * @desc    Place new order
 * @access  Private
 */
router.post("/", apiAuth, async (req, res) => {
	try {
		const { deliveryAddress, deliveryLocation, paymentMethod, mobileMoneyPhone, notes } = req.body;
		
		// Validation
		if (!deliveryAddress) {
			return validationError(res, {
				deliveryAddress: 'Delivery address is required'
			});
		}
		
		if (!paymentMethod) {
			return validationError(res, {
				paymentMethod: 'Payment method is required'
			});
		}
		
		// Validate mobile money phone if mobile money selected
		if ((paymentMethod === 'mtn_mobile_money' || paymentMethod === 'airtel_mobile_money') && !mobileMoneyPhone) {
			return validationError(res, {
				mobileMoneyPhone: 'Mobile money phone number is required'
			});
		}
		
		const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
		
		if (!cart || cart.items.length === 0) {
			return error(res, 'Cart is empty', 400);
		}
		
		// Validate product availability
		for (const item of cart.items) {
			if (!item.product) {
				return error(res, 'Some products in your cart are no longer available', 400);
			}
			
			const product = await Upload.findById(item.product._id);
			if (!product) {
				return error(res, `Product "${item.productName}" is no longer available`, 400);
			}
			
			if (product.quantity < item.quantity) {
				return error(res, `${product.productName} only has ${product.quantity} units available`, 400);
			}
		}
		
		// Create order items
		const orderItems = await Promise.all(cart.items.map(async (item) => {
			const product = await Upload.findById(item.product._id);
			return {
				product: item.product._id,
				productName: item.productName,
				price: item.price,
				quantity: item.quantity,
				image: item.image,
				seller: item.seller || product.owner,
				seller_name: item.seller_name || product.owner_name
			};
		}));
		
		// Generate order number
		const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
		
		// Create order
		const order = new Order({
			orderNumber,
			buyer: req.user._id,
			buyer_name: req.user.Name1,
			buyer_phone: req.user.phonenumber || 'N/A',
			items: orderItems,
			totalPrice: cart.totalPrice,
			deliveryAddress,
			deliveryLocation: deliveryLocation || '',
			paymentMethod,
			mobileMoneyPhone: mobileMoneyPhone || undefined,
			notes: notes || '',
			paymentStatus: (paymentMethod === 'mtn_mobile_money' || paymentMethod === 'airtel_mobile_money') ? 'pending' : 'pending'
		});
		
		await order.save();
		
		// Update product quantities
		for (const item of cart.items) {
			await Upload.findByIdAndUpdate(item.product._id, {
				$inc: { quantity: -item.quantity }
			});
		}
		
		// Clear cart
		cart.items = [];
		cart.totalPrice = 0;
		cart.totalItems = 0;
		await cart.save();
		
		const savedOrder = await Order.findById(order._id)
			.populate('items.product', 'productName image')
			.populate('items.seller', 'Name1 email');
		
		success(res, { order: savedOrder }, 'Order placed successfully', 201);
	} catch (err) {
		console.error("API Place order error:", err);
		if (err.name === 'ValidationError') {
			return validationError(res, err.errors);
		}
		error(res, 'Failed to place order', 500);
	}
});

/**
 * @route   PUT /api/v1/orders/:id/cancel
 * @desc    Cancel order (Buyer only)
 * @access  Private
 */
router.put("/:id/cancel", apiAuth, async (req, res) => {
	try {
		const { cancelReason } = req.body;
		
		const order = await Order.findById(req.params.id);
		
		if (!order) {
			return notFound(res, 'Order');
		}
		
		// Check if user is the buyer
		if (order.buyer.toString() !== req.user._id.toString()) {
			return error(res, 'You can only cancel your own orders', 403);
		}
		
		// Check if order can be cancelled
		if (['delivered', 'cancelled'].includes(order.orderStatus)) {
			return error(res, `Order cannot be cancelled. Current status: ${order.orderStatus}`, 400);
		}
		
		// Restore product quantities
		for (const item of order.items) {
			await Upload.findByIdAndUpdate(item.product, {
				$inc: { quantity: item.quantity }
			});
		}
		
		order.orderStatus = 'cancelled';
		order.cancelReason = cancelReason || 'Cancelled by buyer';
		await order.save();
		
		success(res, { order }, 'Order cancelled successfully');
	} catch (err) {
		console.error("API Cancel order error:", err);
		error(res, 'Failed to cancel order', 500);
	}
});

module.exports = router;

