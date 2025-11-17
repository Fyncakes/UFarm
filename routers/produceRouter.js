const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UpdatingList = require("../models/Upload");
const UserModel = require("../models/User");
const connectEnsureLogin = require("connect-ensure-login");
const { uploadProduct } = require("../config/cloudinary");

router.get("/product", async (req, res) => {
	try {
		// Only show approved products to customers
		const listProduct = await UpdatingList.find({ status: 'approved' })
			.populate("owner")
			.populate("category");
		console.log(`Product page - showing ${listProduct.length} approved products`);
		res.render("productList", { listProducts: listProduct });
	} catch (error) {
		console.error("Error loading products:", error);
		req.flash("error_msg", "Error loading products");
		res.render("productList", { listProducts: [] });
	}
});

// NOTE: This route uses Cloudinary for image storage (online), NOT local folder
// Images are uploaded to Cloudinary and the URL is stored in MongoDB
router.post("/uploadsList", connectEnsureLogin.ensureLoggedIn(), uploadProduct.single("image"), async (req, res) => {
	req.session.user = req.user;
	console.log(req.session.user);

	try {
		const customerList = new UpdatingList(req.body);

		// Store Cloudinary URL (online storage) - NOT local folder
		// req.file.path contains the Cloudinary URL (e.g., https://res.cloudinary.com/...)
		if (req.file) {
			customerList.image = req.file.path; // Cloudinary URL stored in MongoDB
		}

		customerList.owner = req.session.user._id;
		customerList.owner_name = req.session.user.Name1;
		customerList.status = 'pending'; // Set default status

		console.log('Product created with Cloudinary image:', customerList);

		await customerList.save();

		req.flash("success_msg", "Product uploaded successfully! It will be reviewed before appearing on the marketplace.");
		res.redirect("/product");
	} catch (error) {
		console.error("Product upload error:", error);
		req.flash("error_msg", "Product upload failed. Please try again.");
		res.redirect("/product");
	}
});

// View product details
router.get("/product-detail/:id", async (req, res) => {
	try {
		const product = await UpdatingList.findById(req.params.id)
			.populate("owner")
			.populate("category");
		if (!product) {
			req.flash("error_msg", "Product not found");
			return res.redirect("/product");
		}
		res.render("product-detail", { product });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading product");
		res.redirect("/product");
	}
});

module.exports = router;
