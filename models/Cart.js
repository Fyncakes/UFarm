const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	productName: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
	},
	image: {
		type: String,
	},
	seller: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Registration",
	},
	seller_name: {
		type: String,
	},
});

const cartSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Registration",
			required: true,
		},
		items: [cartItemSchema],
		totalPrice: {
			type: Number,
			required: true,
			default: 0,
		},
		totalItems: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

// Method to calculate totals
cartSchema.methods.calculateTotals = function () {
	this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
	this.totalPrice = this.items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
};

module.exports = mongoose.model("Cart", cartSchema);

