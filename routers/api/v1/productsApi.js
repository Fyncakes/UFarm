const express = require("express");
const router = express.Router();
const Upload = require("../../../models/Upload");
const { success, error, notFound, validationError } = require("../../../middleware/apiResponse");
const apiAuth = require("../../../middleware/apiAuth");

/**
 * @route   GET /api/v1/products
 * @desc    Get all approved products
 * @access  Public
 * @query   category, search, minPrice, maxPrice, page, limit
 */
router.get("/", async (req, res) => {
	try {
		const {
			category,
			search,
			minPrice,
			maxPrice,
			page = 1,
			limit = 20,
			sort = 'createdAt',
			order = 'desc'
		} = req.query;
		
		// Build query
		let query = { status: 'approved' };
		
		if (category) {
			query.category = category;
		}
		
		if (search) {
			query.$or = [
				{ productName: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } }
			];
		}
		
		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) query.price.$gte = parseFloat(minPrice);
			if (maxPrice) query.price.$lte = parseFloat(maxPrice);
		}
		
		// Pagination
		const skip = (parseInt(page) - 1) * parseInt(limit);
		
		// Sort
		const sortObj = {};
		sortObj[sort] = order === 'asc' ? 1 : -1;
		
		// Execute query
		const products = await Upload.find(query)
			.populate('category', 'name slug icon')
			.populate('owner', 'Name1 email phonenumber')
			.select('-__v')
			.sort(sortObj)
			.skip(skip)
			.limit(parseInt(limit));
		
		const total = await Upload.countDocuments(query);
		
		success(res, {
			products,
			pagination: {
				currentPage: parseInt(page),
				totalPages: Math.ceil(total / parseInt(limit)),
				totalItems: total,
				itemsPerPage: parseInt(limit),
				hasNext: skip + products.length < total,
				hasPrev: parseInt(page) > 1
			}
		}, 'Products retrieved successfully');
	} catch (err) {
		console.error("API Get products error:", err);
		error(res, 'Failed to retrieve products', 500);
	}
});

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
	try {
		const product = await Upload.findById(req.params.id)
			.populate('category', 'name slug icon description')
			.populate('owner', 'Name1 email phonenumber profileImage verified')
			.select('-__v');
		
		if (!product) {
			return notFound(res, 'Product');
		}
		
		// Only return approved products to public
		if (product.status !== 'approved') {
			return error(res, 'Product not available', 404);
		}
		
		success(res, { product }, 'Product retrieved successfully');
	} catch (err) {
		if (err.name === 'CastError') {
			return notFound(res, 'Product');
		}
		console.error("API Get product error:", err);
		error(res, 'Failed to retrieve product', 500);
	}
});

/**
 * @route   POST /api/v1/products
 * @desc    Create new product (Urban Farmer only)
 * @access  Private (Urban Farmer)
 */
router.post("/", apiAuth, async (req, res) => {
	try {
		// Check role
		if (req.user.role !== 'Urban farmer') {
			return error(res, 'Only Urban Farmers can create products', 403);
		}
		
		const { productName, category, price, quantity, description, direction, organic } = req.body;
		
		// Validation
		if (!productName || !category || !price || !quantity) {
			return validationError(res, {
				productName: productName ? undefined : 'Product name is required',
				category: category ? undefined : 'Category is required',
				price: price ? undefined : 'Price is required',
				quantity: quantity ? undefined : 'Quantity is required'
			});
		}
		
		// Note: Image upload would need to be handled separately via multipart/form-data
		// For now, we'll require image URL or handle it in a separate endpoint
		
		const product = new Upload({
			productName,
			category,
			price: parseFloat(price),
			quantity: parseInt(quantity),
			description: description || '',
			direction: direction || '',
			organic: organic === true || organic === 'true',
			owner: req.user._id,
			owner_name: req.user.Name1,
			status: 'pending',
			image: req.body.image || '' // Should be Cloudinary URL
		});
		
		await product.save();
		
		const savedProduct = await Upload.findById(product._id)
			.populate('category')
			.populate('owner', 'Name1 email');
		
		success(res, { product: savedProduct }, 'Product created successfully. Awaiting approval.', 201);
	} catch (err) {
		console.error("API Create product error:", err);
		if (err.name === 'ValidationError') {
			return validationError(res, err.errors);
		}
		error(res, 'Failed to create product', 500);
	}
});

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update product (Owner only)
 * @access  Private
 */
router.put("/:id", apiAuth, async (req, res) => {
	try {
		const product = await Upload.findById(req.params.id);
		
		if (!product) {
			return notFound(res, 'Product');
		}
		
		// Check ownership
		if (product.owner.toString() !== req.user._id.toString()) {
			return error(res, 'You can only update your own products', 403);
		}
		
		// Update fields
		if (req.body.productName) product.productName = req.body.productName;
		if (req.body.category) product.category = req.body.category;
		if (req.body.price !== undefined) product.price = parseFloat(req.body.price);
		if (req.body.quantity !== undefined) product.quantity = parseInt(req.body.quantity);
		if (req.body.description !== undefined) product.description = req.body.description;
		if (req.body.direction !== undefined) product.direction = req.body.direction;
		if (req.body.organic !== undefined) product.organic = req.body.organic === true || req.body.organic === 'true';
		if (req.body.image) product.image = req.body.image;
		
		// Set status back to pending after edit
		product.status = 'pending';
		
		await product.save();
		
		const updatedProduct = await Upload.findById(product._id)
			.populate('category')
			.populate('owner', 'Name1 email');
		
		success(res, { product: updatedProduct }, 'Product updated successfully. Awaiting re-approval.');
	} catch (err) {
		console.error("API Update product error:", err);
		if (err.name === 'ValidationError') {
			return validationError(res, err.errors);
		}
		error(res, 'Failed to update product', 500);
	}
});

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product (Owner only)
 * @access  Private
 */
router.delete("/:id", apiAuth, async (req, res) => {
	try {
		const product = await Upload.findById(req.params.id);
		
		if (!product) {
			return notFound(res, 'Product');
		}
		
		// Check ownership
		if (product.owner.toString() !== req.user._id.toString()) {
			return error(res, 'You can only delete your own products', 403);
		}
		
		await Upload.findByIdAndDelete(req.params.id);
		
		success(res, null, 'Product deleted successfully');
	} catch (err) {
		console.error("API Delete product error:", err);
		error(res, 'Failed to delete product', 500);
	}
});

module.exports = router;

