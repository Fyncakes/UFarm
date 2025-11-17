const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const connectEnsureLogin = require('connect-ensure-login')
const UploadProductModel = require("../models/Upload");
const UserModel = require("../models/User");
const { uploadProduct } = require("../config/cloudinary");

// Dashboard
router.get("/UB", connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
	try {
		const urbanfarmer = req.user;
		const ufProduce = await UploadProductModel.find({owner_name: req.session.user.Name1})
		
		// Calculate statistics for this farmer
		const totalProducts = ufProduce.length;
		const pendingProducts = ufProduce.filter(p => p.status === 'pending').length;
		const approvedProducts = ufProduce.filter(p => p.status === 'approved').length;
		const rejectedProducts = ufProduce.filter(p => p.status === 'rejected').length;
		
		// Get agent information if registered by Farmer One
		let agentInfo = null;
		if (urbanfarmer.registeredBy) {
			agentInfo = await UserModel.findById(urbanfarmer.registeredBy);
		}
		
		console.log(`Urban Farmer ${urbanfarmer.Name1} - Products: ${totalProducts}`)
		
		res.render("Urban", {
			ufproduces: ufProduce,
			stats: {
				totalProducts,
				pendingProducts,
				approvedProducts,
				rejectedProducts
			},
			agentInfo: agentInfo ? agentInfo.Name1 : null
		});
	} catch (error) {
		console.error("Error loading dashboard:", error);
		req.flash("error_msg", "Error loading dashboard");
		res.redirect("/");
	}
});

// Add Product Page
router.get("/add-product", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const Category = require("../models/Category");
		const categories = await Category.find({ active: true }).sort({ name: 1 });
		res.render("addProduct", { categories });
	} catch (error) {
		console.error("Error loading categories:", error);
		req.flash("error_msg", "Error loading categories. Please try again.");
		res.redirect("/UB");
	}
});

// My Products Page
router.get("/my-products", connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
	try {
		const ufProduce = await UploadProductModel.find({owner_name: req.session.user.Name1});
		res.render("myProducts", {ufproduces: ufProduce});
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading products");
		res.redirect("/UB");
	}
});

// Farmer Orders Page
router.get("/farmer-orders", connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
	try {
		// TODO: Implement order fetching logic
		// For now, pass empty orders array
		res.render("farmerOrders", {orders: []});
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading orders");
		res.redirect("/UB");
	}
});

// Delete Product
router.delete("/delete-product/:id", connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
	try {
		await UploadProductModel.findByIdAndDelete(req.params.id);
		req.flash("success_msg", "Product deleted successfully");
		res.status(200).json({message: "Product deleted"});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: "Error deleting product"});
	}
});

// NOTE: This route uses Cloudinary for image storage (online), NOT local folder
// Images are uploaded to Cloudinary and the URL is stored in MongoDB
router.post("/uploads", connectEnsureLogin.ensureLoggedIn(), uploadProduct.single("image"), async(req, res) => {
	req.session.user = req.user
	console.log(req.session.user)

	try {
		if (!req.file) {
			req.flash("error_msg", "Please upload a product image.");
			return res.redirect("/add-product");
		}

		// Validate category
		if (!req.body.category) {
			req.flash("error_msg", "Please select a product category.");
			return res.redirect("/add-product");
		}

		const newProduct = new UploadProductModel(req.body);

		// Store Cloudinary URL (online storage) - NOT local folder
		// req.file.path contains the Cloudinary URL (e.g., https://res.cloudinary.com/...)
		// This URL is stored in MongoDB, not in the local public/image folder
		newProduct.image = req.file.path; // Cloudinary URL stored in MongoDB

		newProduct.owner = req.session.user._id;
		newProduct.owner_name = req.session.user.Name1;
		newProduct.status = 'pending'; // Always start as pending
		newProduct.organic = req.body.organic === 'on' || req.body.organic === true;

		console.log('Product created with Cloudinary image:', newProduct.image);

		await newProduct.save();
		
		req.flash("success_msg", "Product uploaded successfully! It will be reviewed before appearing on the marketplace.");
		res.redirect("/my-products");
	} catch (error) {
		req.flash("error_msg", "Product upload failed. Please try again.");
		console.error("Product upload error:", error);
		res.redirect("/add-product");
	}
});

// Edit Product Page
router.get("/edit-product/:id", connectEnsureLogin.ensureLoggedIn(), async(req, res) => {
	try {
		const product = await UploadProductModel.findById(req.params.id);
		
		if (!product) {
			req.flash("error_msg", "Product not found");
			return res.redirect("/my-products");
		}
		
		// Check if product belongs to user
		if (product.owner_name !== req.session.user.Name1) {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/my-products");
		}
		
		res.render("editProduct", { product });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading product");
		res.redirect("/my-products");
	}
});

// Update Product (with re-approval)
router.post("/update-product/:id", connectEnsureLogin.ensureLoggedIn(), uploadProduct.single("image"), async(req, res) => {
	try {
		const product = await UploadProductModel.findById(req.params.id);
		
		if (!product) {
			req.flash("error_msg", "Product not found");
			return res.redirect("/my-products");
		}
		
		// Check if product belongs to user
		if (product.owner_name !== req.session.user.Name1) {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/my-products");
		}
		
		// Validate category
		if (!req.body.category) {
			req.flash("error_msg", "Please select a product category.");
			return res.redirect(`/edit-product/${req.params.id}`);
		}

		// Update product fields
		product.productName = req.body.productName;
		product.category = req.body.category;
		product.price = req.body.price;
		product.quantity = req.body.quantity;
		product.description = req.body.description;
		product.direction = req.body.direction;
		product.organic = req.body.organic === 'on' || req.body.organic === true;
		
		// Update image if new one uploaded (Cloudinary URL - online storage, NOT local folder)
		if (req.file) {
			product.image = req.file.path; // Cloudinary URL stored in MongoDB
		}
		
		// IMPORTANT: Set status back to pending for re-approval
		product.status = 'pending';
		
		await product.save();
		
		req.flash("success_msg", "Product updated successfully! It will be reviewed again before appearing on the marketplace.");
		res.redirect("/my-products");
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error updating product");
		res.redirect("/my-products");
	}
});

module.exports = router;
