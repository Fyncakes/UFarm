// Seed Script to Populate Product Categories for Ufarm
require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");
const config = require("./config/db");

// Required Product Categories
const categories = [
	{
		name: "Seedlings",
		description: "Young plants and seedlings ready for planting",
		icon: "fa-seedling",
		active: true,
	},
	{
		name: "Machinery",
		description: "Farm machinery and equipment",
		icon: "fa-tractor",
		active: true,
	},
	{
		name: "Plants",
		description: "Mature plants and trees",
		icon: "fa-leaf",
		active: true,
	},
	{
		name: "Organic Fertilizers",
		description: "Natural and organic fertilizers for crops",
		icon: "fa-recycle",
		active: true,
	},
	{
		name: "Farm Tools",
		description: "Hand tools and equipment for farming",
		icon: "fa-tools",
		active: true,
	},
	{
		name: "Fresh Produce",
		description: "Fresh fruits, vegetables, and farm produce",
		icon: "fa-apple-alt",
		active: true,
	},
	{
		name: "Livestock & Poultry",
		description: "Animals, livestock, and poultry products",
		icon: "fa-dog",
		active: true,
	},
	{
		name: "Herbs & Spices",
		description: "Fresh and dried herbs and spices",
		icon: "fa-pepper-hot",
		active: true,
	},
	{
		name: "Others",
		description: "General category for other farming products",
		icon: "fa-box",
		active: true,
	},
];

async function seedCategories() {
	try {
		// Connect to MongoDB
		await mongoose.connect(config.database, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB connected for seeding categories...");

		// Clear existing categories (optional - comment out if you want to keep existing)
		// await Category.deleteMany({});
		// console.log("Cleared existing categories");

		// Insert categories
		let created = 0;
		let skipped = 0;

		for (const categoryData of categories) {
			try {
				// Check if category already exists
				const existing = await Category.findOne({ name: categoryData.name });
				if (existing) {
					console.log(`Category "${categoryData.name}" already exists, skipping...`);
					skipped++;
					continue;
				}

				const category = new Category(categoryData);
				await category.save();
				console.log(`✓ Created category: ${categoryData.name}`);
				created++;
			} catch (error) {
				if (error.code === 11000) {
					console.log(`Category "${categoryData.name}" already exists (duplicate), skipping...`);
					skipped++;
				} else {
					console.error(`Error creating category "${categoryData.name}":`, error.message);
				}
			}
		}

		console.log("\n=== Category Seeding Complete ===");
		console.log(`Created: ${created} categories`);
		console.log(`Skipped: ${skipped} categories (already exist)`);
		console.log(`Total: ${categories.length} categories processed`);

		// List all categories
		const allCategories = await Category.find({ active: true }).sort({ name: 1 });
		console.log("\nActive Categories:");
		allCategories.forEach((cat) => {
			console.log(`  - ${cat.name} (${cat.slug})`);
		});

		process.exit(0);
	} catch (error) {
		console.error("Error seeding categories:", error);
		process.exit(1);
	}
}

// Run the seed function
seedCategories();

