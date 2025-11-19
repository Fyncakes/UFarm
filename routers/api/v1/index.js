const express = require("express");
const router = express.Router();

// Import API route modules
const authApi = require("./authApi");
const productsApi = require("./productsApi");
const cartApi = require("./cartApi");
const ordersApi = require("./ordersApi");
const categoriesApi = require("./categoriesApi");

// API Routes
router.use("/auth", authApi);
router.use("/products", productsApi);
router.use("/cart", cartApi);
router.use("/orders", ordersApi);
router.use("/categories", categoriesApi);

/**
 * @route   GET /api/v1
 * @desc    API information
 * @access  Public
 */
router.get("/", (req, res) => {
	res.json({
		success: true,
		message: "Ufarm API v1",
		version: "1.0.0",
		endpoints: {
			auth: {
				login: "POST /api/v1/auth/login",
				register: "POST /api/v1/auth/register",
				me: "GET /api/v1/auth/me"
			},
			products: {
				list: "GET /api/v1/products",
				get: "GET /api/v1/products/:id",
				create: "POST /api/v1/products",
				update: "PUT /api/v1/products/:id",
				delete: "DELETE /api/v1/products/:id"
			},
			cart: {
				get: "GET /api/v1/cart",
				add: "POST /api/v1/cart/add",
				update: "PUT /api/v1/cart/update/:itemId",
				remove: "DELETE /api/v1/cart/remove/:itemId",
				clear: "DELETE /api/v1/cart/clear"
			},
			orders: {
				list: "GET /api/v1/orders",
				get: "GET /api/v1/orders/:id",
				create: "POST /api/v1/orders",
				cancel: "PUT /api/v1/orders/:id/cancel"
			},
			categories: {
				list: "GET /api/v1/categories",
				get: "GET /api/v1/categories/:id",
				products: "GET /api/v1/categories/:id/products"
			}
		},
		documentation: "See API_DOCUMENTATION.md for full details",
		authentication: "Use JWT token in Authorization header: Bearer <token>"
	});
});

module.exports = router;

