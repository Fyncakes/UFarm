const express = require("express");
const router = express.Router();
const connectEnsureLogin = require("connect-ensure-login");
const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Add review
router.post("/product/:id/review", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const { rating, comment } = req.body;
		const productId = req.params.id;

		// Check if product exists
		const product = await Product.findById(productId);
		if (!product) {
			req.flash("error_msg", "Product not found");
			return res.redirect("/product");
		}

		// Check if user has purchased this product
		const order = await Order.findOne({
			buyer: req.user._id,
			"items.product": productId,
			orderStatus: "delivered",
		});

		if (!order) {
			req.flash("error_msg", "You can only review products you have purchased");
			return res.redirect(`/product/${productId}`);
		}

		// Check if user already reviewed this product
		const existingReview = await Review.findOne({
			product: productId,
			user: req.user._id,
		});

		if (existingReview) {
			// Update existing review
			existingReview.rating = rating;
			existingReview.comment = comment;
			await existingReview.save();
			req.flash("success_msg", "Review updated successfully");
		} else {
			// Create new review
			const review = new Review({
				product: productId,
				user: req.user._id,
				user_name: req.user.Name1,
				rating,
				comment,
			});
			await review.save();
			req.flash("success_msg", "Review added successfully");
		}

		// Update product rating
		await updateProductRating(productId);

		res.redirect(`/product-detail/${productId}`);
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error adding review");
		res.redirect("/product");
	}
});

// Get reviews for a product
router.get("/product/:id/reviews", async (req, res) => {
	try {
		const reviews = await Review.find({ product: req.params.id })
			.populate("user")
			.sort({ createdAt: -1 });

		res.render("reviews", { reviews, productId: req.params.id });
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error loading reviews");
		res.redirect("/product");
	}
});

// Delete review
router.post("/review/:id/delete", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	try {
		const review = await Review.findById(req.params.id);

		if (!review) {
			req.flash("error_msg", "Review not found");
			return res.redirect("/product");
		}

		// Check if user owns this review or is admin
		if (
			review.user.toString() !== req.user._id.toString() &&
			req.user.role !== "Agriculture Officer"
		) {
			req.flash("error_msg", "Unauthorized access");
			return res.redirect("/product");
		}

		const productId = review.product;
		await Review.findByIdAndDelete(req.params.id);

		// Update product rating
		await updateProductRating(productId);

		req.flash("success_msg", "Review deleted successfully");
		res.redirect(`/product-detail/${productId}`);
	} catch (error) {
		console.error(error);
		req.flash("error_msg", "Error deleting review");
		res.redirect("/product");
	}
});

// Helper function to update product rating
async function updateProductRating(productId) {
	const reviews = await Review.find({ product: productId });
	const product = await Product.findById(productId);

	if (product) {
		product.numReviews = reviews.length;
		if (reviews.length > 0) {
			const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
			product.rating = totalRating / reviews.length;
		} else {
			product.rating = 0;
		}
		await product.save();
	}
}

module.exports = router;

