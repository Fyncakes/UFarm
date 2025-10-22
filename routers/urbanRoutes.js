const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const connectEnsureLogin = require('connect-ensure-login')
const UploadProductModel = require("../models/Upload");
const UserModel = require("../models/User");

//.................................image upload....................................
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/image");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

//........................... instantiate variable upload to store multer functionality to upload image

var upload = multer({ storage: storage });

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
router.get("/add-product", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	res.render("addProduct");
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

router.post("/uploads", connectEnsureLogin.ensureLoggedIn(), upload.single("image"), async(req, res) => {
	req.session.user = req.user
	console.log(req.session.user)

	try {
		const uploadProduct = new  UploadProductModel(req.body);

		// Fix image path: remove 'public/' and convert backslashes to forward slashes
		uploadProduct.image = `image/${req.file.filename}`;

		uploadProduct.owner = req.session.user._id,

		uploadProduct.owner_name = req.session.user.Name1

		console.log(uploadProduct)

		await uploadProduct.save();
		
		req.flash("success_msg", "Product uploaded successfully! It will be reviewed before appearing on the marketplace.");
		res.redirect("/my-products");
	} catch (error) {
		req.flash("error_msg", "Product upload failed. Please try again.");
		console.log(error);
		res.redirect("/add-product");
	}
});

module.exports = router;
