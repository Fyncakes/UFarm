const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const flash = require("connect-flash");
require("dotenv").config();

// Import configuration
const config = require("./config/db");

// Initialize Express app
const app = express();

// Connect to MongoDB with improved settings for production
mongoose
	.connect(config.database, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 30000, // 30 seconds timeout
		socketTimeoutMS: 45000, // 45 seconds socket timeout
	})
	.then(() => {
		console.log("MongoDB connected successfully");
		console.log("Database:", config.database.includes('mongodb+srv') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB');
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
		console.error("Check your MONGODB_URI environment variable");
		// Don't exit, let the app try to reconnect
	});

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
	console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
	console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
	console.log('Mongoose disconnected');
});

// Import models
const User = require("./models/User");
const Category = require("./models/Category");
const Upload = require("./models/Upload");
const Registration = require("./models/User");
const Testimonial = require("./models/Testimonial");

// Passport configuration
require("./config/passport")(passport);

// View engine setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files with proper MIME types (important for video files on Render)
app.use(express.static(path.join(__dirname, "public"), {
	maxAge: '1d', // Cache static files for 1 day
	setHeaders: (res, filePath) => {
		// Ensure video files are served with correct MIME type
		if (filePath.endsWith('.mp4')) {
			res.setHeader('Content-Type', 'video/mp4');
		}
	}
}));
app.use(methodOverride("_method"));

// Session configuration
app.use(
	session({
		secret: config.secret,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
	})
);

// Flash messages
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

// Import routes
const authRoutes = require("./routers/authRoutes");
const signupRoutes = require("./routers/SignupRoutes");
const urbanRoutes = require("./routers/urbanRoutes");
const farmeroneRoutes = require("./routers/farmeroneRouters");
const produceRoutes = require("./routers/produceRouter");
const bookingRoutes = require("./routers/bookingandorderRoute");
const agricRoutes = require("./routers/agricRouter");
const cartRoutes = require("./routers/cartRouter");
const orderRoutes = require("./routers/orderRouter");
const reviewRoutes = require("./routers/reviewRouter");
const categoryRoutes = require("./routers/categoryRouter");
const profileRoutes = require("./routers/profileRouter");
const wishlistRoutes = require("./routers/wishlistRouter");
const testimonialRoutes = require("./routers/testimonialRouter");

// Home route
app.get("/", async (req, res) => {
	try {
		const categories = await Category.find({ active: true }).limit(8);
		const featuredProducts = await Upload.find({ status: 'approved' }).limit(8).sort({ createdAt: -1 });
		const testimonials = await Testimonial.find({ approved: true, featured: true }).limit(6).sort({ createdAt: -1 });
		const totalProducts = await Upload.countDocuments({ status: 'approved' });
		const totalFarmers = await Registration.countDocuments({ role: { $in: ['Urban farmer', 'Farmer one'] } });
		const totalUsers = await Registration.countDocuments({ role: 'user' });
		
		res.render("home", { 
			categories,
			featuredProducts,
			testimonials,
			stats: {
				totalProducts,
				totalFarmers,
				totalUsers
			}
		});
	} catch (error) {
		console.error("Error fetching home page data:", error);
		res.render("home", { 
			categories: [], 
			featuredProducts: [],
			testimonials: [],
			stats: {
				totalProducts: 0,
				totalFarmers: 0,
				totalUsers: 0
			}
		});
	}
});

// About route
app.get("/about", async (req, res) => {
	try {
		const testimonials = await Testimonial.find({ approved: true })
			.sort({ createdAt: -1 })
			.limit(12);
		res.render("About_us", { testimonials });
	} catch (error) {
		console.error("Error fetching testimonials:", error);
		res.render("About_us", { testimonials: [] });
	}
});

// Terms and Conditions route
app.get("/terms", (req, res) => {
	res.render("terms-and-conditions");
});

// Join Requirements route
app.get("/join-requirements", (req, res) => {
	res.render("joinRequirements");
});

// Admin Registration Page
app.get("/admin/register", (req, res) => {
	res.render("admin-register");
});

// Admin Registration Handler
app.post("/admin/register", async (req, res) => {
	try {
		const Registration = require("./models/User");
		
		// Validate that role is Agriculture Officer
		if (req.body.role !== "Agriculture Officer") {
			req.flash("error_msg", "Invalid role. Only Agriculture Officer accounts can be created here.");
			return res.redirect("/admin/register");
		}
		
		// Check if username already exists
		const existingUser = await Registration.findOne({ Name1: req.body.Name1 });
		if (existingUser) {
			req.flash("error_msg", "Username already exists. Please choose a different username.");
			return res.redirect("/admin/register");
		}
		
		// Validate password confirmation
		if (req.body.password !== req.body.confirmPassword) {
			req.flash("error_msg", "Passwords do not match. Please try again.");
			return res.redirect("/admin/register");
		}
		
		// Create admin account
		const adminData = {
			Name1: req.body.Name1,
			role: "Agriculture Officer",
			email: req.body.email,
			phonenumber: req.body.phonenumber,
			Gender1: req.body.Gender1,
			district: req.body.district,
			address: req.body.address,
			bio: req.body.bio,
			verified: req.body.verified === 'on' || req.body.verified === true,
			active: req.body.active === 'on' || req.body.active === true
		};
		
		const admin = new Registration(adminData);
		
		console.log('Creating Agriculture Officer account:', req.body.Name1);
		
		// Register admin with password using passport-local-mongoose
		await Registration.register(admin, req.body.password, (error) => {
			if (error) {
				console.error("Admin registration error:", error);
				if (error.name === 'UserExistsError') {
					req.flash("error_msg", "Username already exists. Please choose a different username.");
				} else {
					req.flash("error_msg", "Registration failed. Please try again.");
				}
				return res.redirect("/admin/register");
			}
			
			req.flash("success_msg", `Agriculture Officer account "${req.body.Name1}" created successfully! You can now login.`);
			res.redirect("/login");
		});
	} catch (error) {
		console.error("Admin registration error:", error);
		if (error.code === 11000) {
			req.flash("error_msg", "Username already exists. Please choose a different username.");
		} else {
			req.flash("error_msg", "Registration failed. Please check your information and try again.");
		}
		res.redirect("/admin/register");
	}
});

// Uploads route - redirect to products page
app.get("/uploads", (req, res) => {
	res.redirect("/product");
});

// Feature pages routes
app.get("/fresh-organic", (req, res) => {
	res.render("freshOrganic");
});

app.get("/direct-connection", (req, res) => {
	res.render("directConnection");
});

app.get("/trusted-verified", (req, res) => {
	res.render("trustedVerified");
});

// Use routes
app.use(authRoutes);
app.use(signupRoutes);
app.use(urbanRoutes);
app.use(farmeroneRoutes);
app.use(produceRoutes);
app.use(bookingRoutes);
app.use(agricRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(reviewRoutes);
app.use(categoryRoutes);
app.use(profileRoutes);
app.use(wishlistRoutes);
app.use(testimonialRoutes);

// 404 handler
app.use((req, res) => {
	res.status(404).render("404");
});

// Error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).render("error", { error: err });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Ufarm server running on port ${PORT}`);
	console.log(`Visit http://localhost:${PORT}`);
});

