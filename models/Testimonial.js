const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Registration",
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			required: true,
			maxlength: 500,
		},
		approved: {
			type: Boolean,
			default: false,
		},
		featured: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Testimonial", testimonialSchema);

