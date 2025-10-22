const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const Category = require("../models/Category");
const Product = require("../models/Product");

// View all categories
router.get("/categories", async (req, res) => {
	try {
		const categories = await Category.find({ active: true });
		res.render("categories", { categories });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading categories");
		res.redirect("/");
	}
});

// View products by category
router.get("/category/:slug", async (req, res) => {
	try {
		const category = await Category.findOne({ slug: req.params.slug, active: true });

		if (!category) {
			req.flash("error_msg", "Category not found");
			return res.redirect("/categories");
		}

		const products = await Product.find({
			category: category._id,
			status: "approved",
		}).populate("owner");

		res.render("categoryProducts", { category, products });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading products");
		res.redirect("/categories");
	}
});

// Add category (Agriculture Officer only)
router.post("/category/add", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/categories");
		}

		const { name, description } = req.body;
		const slug = name.toLowerCase().replace(/\s+/g, "-");

		const category = new Category({
			name,
			description,
			slug,
		});

		await category.save();
		req.flash("success_msg", "Category added successfully");
		res.redirect("/OA");
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error adding category");
		res.redirect("/OA");
	}
});

// Update category (Agriculture Officer only)
router.post("/category/:id/update", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/categories");
		}

		const { name, description, active } = req.body;
		const slug = name.toLowerCase().replace(/\s+/g, "-");

		await Category.findByIdAndUpdate(req.params.id, {
			name,
			description,
			slug,
			active: active === "true",
		});

		req.flash("success_msg", "Category updated successfully");
		res.redirect("/OA");
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error updating category");
		res.redirect("/OA");
	}
});

// Delete category (Agriculture Officer only)
router.post("/category/:id/delete", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		if (req.user.role !== "Agriculture Officer") {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/categories");
		}

		const category = await Category.findById(req.params.id);
		if (!category) {
			req.flash("error_msg", "Category not found");
			return res.redirect("/OA");
		}

		// Check if category has products
		const productsCount = await Product.countDocuments({ category: category._id });
		if (productsCount > 0) {
			req.flash("error_msg", "Cannot delete category with products");
			return res.redirect("/OA");
		}

		await Category.findByIdAndDelete(req.params.id);
		req.flash("success_msg", "Category deleted successfully");
		res.redirect("/OA");
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error deleting category");
		res.redirect("/OA");
	}
});

module.exports = router;

