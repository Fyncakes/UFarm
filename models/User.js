const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
	{
		role: {
			type: String,
			required: true,
			enum: ["Farmer one", "Urban farmer", "Agriculture Officer", "user", "buyer", "seller"],
			trim: true,
		},
		Name1: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			sparse: true,
		},
		Gender1: {
			type: String,
			enum: ["Male", "Female", "Other"],
		},
		Date1: {
			type: Date,
		},
		Date2: {
			type: Date,
		},
		Activities: {
			type: String,
			trim: true,
		},
		phonenumber: {
			type: String,
			required: true,
			trim: true,
		},
		Nin1: {
			type: String,
			trim: true,
		},
		Ward1: {
			type: String,
			trim: true,
		},
		Role1: {
			type: String,
			trim: true,
		},
		UserID: {
			type: String,
			required: false,
			trim: true,
		},
		// Farmer specific fields
		farmSize: {
			type: Number,
		},
		farmLocation: {
			type: String,
			trim: true,
		},
		farmType: {
			type: String,
			enum: ["crops", "livestock", "mixed", "poultry", "dairy"],
		},
		// Address fields
		address: {
			type: String,
			trim: true,
		},
		district: {
			type: String,
			trim: true,
		},
		village: {
			type: String,
			trim: true,
		},
		// Account status
		verified: {
			type: Boolean,
			default: false,
		},
		active: {
			type: Boolean,
			default: true,
		},
		// Profile image
		profileImage: {
			type: String,
		},
		// Additional information
		bio: {
			type: String,
			maxlength: 500,
		},
		// Ratings (for farmers/sellers)
		rating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		numRatings: {
			type: Number,
			default: 0,
		},
		// Statistics
		totalSales: {
			type: Number,
			default: 0,
		},
		totalOrders: {
			type: Number,
			default: 0,
		},
		// Farmer One Agent tracking
		registeredBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Registration",
		},
		registeredByName: {
			type: String,
		},
		registrationDate: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.plugin(passportLocalMongoose, {
	usernameField: "Name1",
});

// Create indexes for better query performance
userSchema.index({ role: 1, active: 1 });
userSchema.index({ Name1: 1 });

module.exports = mongoose.model("Registration", userSchema);
