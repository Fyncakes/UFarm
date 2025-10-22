const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
	{
		productName: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
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
		image: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Registration",
			required: true,
		},
		owner_name: {
			type: String,
			required: true,
		},
		direction: {
			type: String,
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Upload", uploadSchema);

