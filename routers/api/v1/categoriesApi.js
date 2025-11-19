const express = require("express");
const router = express.Router();
const Category = require("../../../models/Category");
const Upload = require("../../../models/Upload");
const { success, error, notFound } = require("../../../middleware/apiResponse");

/**
 * @route   GET /api/v1/categories
 * @desc    Get all active categories
 * @access  Public
 */
router.get("/", async (req, res) => {
	try {
		const categories = await Category.find({ active: true })
			.sort({ name: 1 })
			.select('-__v');
		
		success(res, { categories }, 'Categories retrieved successfully');
	} catch (err) {
		console.error("API Get categories error:", err);
		error(res, 'Failed to retrieve categories', 500);
	}
});

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get single category
 * @access  Public
 */
router.get("/:id", async (req, res) => {
	try {
		const category = await Category.findById(req.params.id)
			.select('-__v');
		
		if (!category) {
			return notFound(res, 'Category');
		}
		
		success(res, { category }, 'Category retrieved successfully');
	} catch (err) {
		if (err.name === 'CastError') {
			return notFound(res, 'Category');
		}
		console.error("API Get category error:", err);
		error(res, 'Failed to retrieve category', 500);
	}
});

/**
 * @route   GET /api/v1/categories/:id/products
 * @desc    Get products in category
 * @access  Public
 */
router.get("/:id/products", async (req, res) => {
	try {
		const { page = 1, limit = 20 } = req.query;
		const skip = (parseInt(page) - 1) * parseInt(limit);
		
		const category = await Category.findById(req.params.id);
		if (!category) {
			return notFound(res, 'Category');
		}
		
		const products = await Upload.find({ 
			category: req.params.id,
			status: 'approved'
		})
			.populate('owner', 'Name1 email')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit))
			.select('-__v');
		
		const total = await Upload.countDocuments({ 
			category: req.params.id,
			status: 'approved'
		});
		
		success(res, {
			category,
			products,
			pagination: {
				currentPage: parseInt(page),
				totalPages: Math.ceil(total / parseInt(limit)),
				totalItems: total,
				itemsPerPage: parseInt(limit)
			}
		}, 'Category products retrieved successfully');
	} catch (err) {
		console.error("API Get category products error:", err);
		error(res, 'Failed to retrieve category products', 500);
	}
});

module.exports = router;

