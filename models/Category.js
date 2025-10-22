const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		description: {
			type: String,
			trim: true,
		},
		image: {
			type: String,
		},
		icon: {
			type: String,
			default: "fa-box",
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

// Auto-generate slug from name before saving
categorySchema.pre("save", function (next) {
	if (this.isModified("name") || !this.slug) {
		this.slug = this.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
	}
	next();
});

module.exports = mongoose.model("Category", categorySchema);

