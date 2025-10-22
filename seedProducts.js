// Seed Script to Populate Demo Products for Ufarm
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Upload = require("./models/Upload");
const config = require("./config/db");

// Demo products with your images
const demoProducts = [
	{
		productName: "Hybrid Maize Seeds",
		description: "High-yielding hybrid maize seeds for increased productivity. Suitable for all soil types.",
		price: 25000,
		quantity: 100,
		image: "image/Hybrid Maize Seeds.jpeg",
		direction: "Kampala District, Uganda",
		status: "approved",
	},
	{
		productName: "Organic Compost",
		description: "100% natural compost to enrich soil fertility and improve crop yield.",
		price: 15000,
		quantity: 200,
		image: "image/Organic Compost.jpg",
		direction: "Wakiso District, Uganda",
		status: "approved",
	},
	{
		productName: "Drip Irrigation Kit",
		description: "Water-saving irrigation system suitable for vegetables, fruits, and flowers.",
		price: 150000,
		quantity: 50,
		image: "image/Drip Irrigation Kit.webp",
		direction: "Mukono District, Uganda",
		status: "approved",
	},
	{
		productName: "Knapsack Sprayer (16L)",
		description: "Manual sprayer for applying pesticides and fertilizers with ease.",
		price: 85000,
		quantity: 75,
		image: "image/Knapsack Sprayer (16L).png",
		direction: "Jinja District, Uganda",
		status: "approved",
	},
	{
		productName: "Neem Oil Pesticide",
		description: "Natural bio-pesticide to control pests without harming the environment.",
		price: 35000,
		quantity: 120,
		image: "image/Neem Oil Pesticide.jpeg",
		direction: "Masaka District, Uganda",
		status: "approved",
	},
	{
		productName: "Urea Fertilizer (50kg)",
		description: "Nitrogen-rich fertilizer to boost plant growth and productivity.",
		price: 120000,
		quantity: 80,
		image: "image/Urea Fertilizer (50kg).avif",
		direction: "Mbarara District, Uganda",
		status: "approved",
	},
	{
		productName: "Solar Water Pump",
		description: "Solar-powered irrigation pump ideal for remote farms with no electricity.",
		price: 450000,
		quantity: 30,
		image: "image/Solar Water Pump.jpeg",
		direction: "Gulu District, Uganda",
		status: "approved",
	},
	{
		productName: "Paddy Transplanter",
		description: "Machine for easy and quick transplanting of rice seedlings. Saves labor cost.",
		price: 850000,
		quantity: 15,
		image: "image/Paddy Transplanter.jpeg",
		direction: "Lira District, Uganda",
		status: "approved",
	},
	{
		productName: "Cow Dung Manure",
		description: "Organic fertilizer made from aged cow dung; enhances soil structure.",
		price: 18000,
		quantity: 150,
		image: "image/Cow Dung Manure.jpeg",
		direction: "Mbale District, Uganda",
		status: "approved",
	},
	{
		productName: "Bio Fungicide",
		description: "Organic solution to prevent fungal diseases in crops.",
		price: 42000,
		quantity: 90,
		image: "image/Bio Fungicide.webp",
		direction: "Hoima District, Uganda",
		status: "approved",
	},
	{
		productName: "Garden Hoe",
		description: "Hand tool for tilling, weeding, and soil aeration in small farms.",
		price: 15000,
		quantity: 200,
		image: "image/Garden Hoe.webp",
		direction: "Kabale District, Uganda",
		status: "approved",
	},
	{
		productName: "High-Yield Tomato Seeds",
		description: "Disease-resistant hybrid tomato seeds for commercial farming.",
		price: 28000,
		quantity: 110,
		image: "image/High-Yield Tomato Seeds.jpg",
		direction: "Kasese District, Uganda",
		status: "approved",
	},
	{
		productName: "Vermicompost",
		description: "Earthworm compost rich in nutrients and excellent for vegetable farming.",
		price: 22000,
		quantity: 130,
		image: "image/compost-with-redworm-vermicompost.webp",
		direction: "Soroti District, Uganda",
		status: "approved",
	},
	{
		productName: "Poultry Feed (Layer)",
		description: "Nutritional feed mix for egg-laying hens to improve productivity.",
		price: 65000,
		quantity: 95,
		image: "image/Poultry Feed (Layer).jpeg",
		direction: "Arua District, Uganda",
		status: "approved",
	},
	{
		productName: "Soil Testing Kit",
		description: "Easy-to-use kit to test soil pH, moisture, and nutrient levels.",
		price: 55000,
		quantity: 60,
		image: "image/Soil Testing Kit.jpeg",
		direction: "Kampala District, Uganda",
		status: "approved",
	},
];

async function seedDatabase() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(config.database, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("✅ Connected to MongoDB");

		// Create a demo farmer if none exists
		let demoFarmer = await User.findOne({ Name1: "Demo Farmer" });
		
		if (!demoFarmer) {
			console.log("Creating demo farmer account...");
			demoFarmer = new User({
				Name1: "Demo Farmer",
				role: "Urban farmer",
				phonenumber: "0700123456",
				Gender1: "Male",
				verified: true,
				active: true,
				farmLocation: "Central Uganda",
				farmType: "mixed",
			});

			await User.register(demoFarmer, "demo123");
			demoFarmer = await User.findOne({ Name1: "Demo Farmer" });
			console.log("✅ Demo farmer created");
		}

		// Check if products already exist
		const existingProducts = await Upload.countDocuments();
		
		if (existingProducts > 0) {
			console.log(`⚠️  Database already has ${existingProducts} products.`);
			console.log("Do you want to delete existing products and reseed? (You'll need to modify this script)");
			// Uncomment the line below to clear existing products
			// await Upload.deleteMany({});
		}

		console.log("Seeding products...");
		
		for (const product of demoProducts) {
			const newProduct = new Upload({
				...product,
				owner: demoFarmer._id,
				owner_name: demoFarmer.Name1,
			});

			await newProduct.save();
			console.log(`✅ Added: ${product.productName}`);
		}

		console.log("\n🎉 Database seeded successfully!");
		console.log(`\n📊 Summary:`);
		console.log(`   - Products added: ${demoProducts.length}`);
		console.log(`   - Demo farmer: Demo Farmer / demo123`);
		console.log(`\n🌐 You can now visit: http://localhost:3000/product`);
		console.log(`\n💡 Demo Farmer Login:`);
		console.log(`   Username: Demo Farmer`);
		console.log(`   Password: demo123`);

	} catch (error) {
		console.error("❌ Error seeding database:", error);
	} finally {
		await mongoose.connection.close();
		console.log("\n✅ Database connection closed");
		process.exit(0);
	}
}

// Run the seed function
seedDatabase();

