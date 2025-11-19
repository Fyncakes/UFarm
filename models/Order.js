const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Upload",
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
		required: true,
	},
	seller_name: {
		type: String,
		required: true,
	},
	seller_phone: {
		type: String,
	},
});

const orderSchema = new mongoose.Schema(
	{
		orderNumber: {
			type: String,
			required: true,
			unique: true,
		},
		buyer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Registration",
			required: true,
		},
		buyer_name: {
			type: String,
			required: true,
		},
		buyer_phone: {
			type: String,
			required: true,
		},
		items: [orderItemSchema],
		totalPrice: {
			type: Number,
			required: true,
		},
		deliveryAddress: {
			type: String,
			required: true,
		},
		deliveryLocation: {
			type: String,
		},
		paymentMethod: {
			type: String,
			enum: ["cash_on_delivery", "mtn_mobile_money", "airtel_mobile_money", "bank_transfer"],
			default: "cash_on_delivery",
		},
		mobileMoneyPhone: {
			type: String,
			trim: true,
		},
		paymentStatus: {
			type: String,
			enum: ["pending", "paid", "failed"],
			default: "pending",
		},
		orderStatus: {
			type: String,
			enum: [
				"pending",
				"confirmed",
				"processing",
				"ready",
				"in_transit",
				"delivered",
				"cancelled",
			],
			default: "pending",
		},
		notes: {
			type: String,
		},
		deliveryDate: {
			type: Date,
		},
		cancelReason: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
	if (!this.orderNumber) {
		const count = await mongoose.model("Order").countDocuments();
		this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
	}
	next();
});

module.exports = mongoose.model("Order", orderSchema);

