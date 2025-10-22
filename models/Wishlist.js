const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Registration",
			required: true,
			unique: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Upload",
					required: true,
				},
				addedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Wishlist", wishlistSchema);

