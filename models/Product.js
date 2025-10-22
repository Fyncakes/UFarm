const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		productName: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		quantity: {
			type: Number,
			required: true,
			min: 0,
		},
		unit: {
			type: String,
			required: true,
			enum: ["kg", "g", "lbs", "piece", "dozen", "bunch", "bag"],
		},
		image: {
			type: String,
			required: true,
		},
		images: [
			{
				type: String,
			},
		],
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Registration",
			required: true,
		},
		owner_name: {
			type: String,
			required: true,
		},
		owner_phone: {
			type: String,
		},
		location: {
			type: String,
			required: true,
		},
		direction: {
			type: String,
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected", "out_of_stock"],
			default: "pending",
		},
		rating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		numReviews: {
			type: Number,
			default: 0,
		},
		featured: {
			type: Boolean,
			default: false,
		},
		organic: {
			type: Boolean,
			default: false,
		},
		harvestDate: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

// Create indexes for better search performance
productSchema.index({ productName: "text", description: "text" });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ owner: 1 });

module.exports = mongoose.model("Product", productSchema);

