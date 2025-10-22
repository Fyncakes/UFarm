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

// Connect to MongoDB
mongoose
	.connect(config.database, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected successfully"))
	.catch((err) => console.log("MongoDB connection error:", err));

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
app.use(express.static(path.join(__dirname, "public")));
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

// Join Requirements route
app.get("/join-requirements", (req, res) => {
	res.render("joinRequirements");
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

