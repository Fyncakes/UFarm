const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UpdatingList = require("../models/Upload");
const UserModel = require("../models/User");
const connectEnsureLogin = require("connect-ensure-login");

router.get("/product", async (req, res) => {
	try {
		// Only show approved products to customers
		const listProduct = await UpdatingList.find({ status: 'approved' }).populate("owner");
		console.log(`Product page - showing ${listProduct.length} approved products`);
		res.render("productList", { listProducts: listProduct });
	} catch (error) {
		console.error("Error loading products:", error);
		req.flash("error_msg", "Error loading products");
		res.render("productList", { listProducts: [] });
	}
});

router.post("/uploadsList", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	req.session.user = req.user;
	console.log(req.session.user);

	// res.send('This works');
	try {
		const customerList = UpdatingList(req.body);

		customerList.image = req.file.path;
		// console.log('This is the uploaded', uploadProduct)

		(customerList.owner = req.session.user._id),
			(customerList.owner_name = req.session.user.Name1);

		console.log(customerList);

		await customerList.save();

		res.redirect("/product");
	} catch (error) {
		res.status(400).send("you registration has failed");
		console.log(error);
	}
});

// View product details
router.get("/product-detail/:id", async (req, res) => {
	try {
		const product = await UpdatingList.findById(req.params.id).populate("owner");
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
