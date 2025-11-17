require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

/**
 * CLOUDINARY IMAGE STORAGE CONFIGURATION
 * 
 * IMPORTANT: All user-uploaded images are stored ONLINE in Cloudinary, NOT in local folders.
 * - Images are uploaded directly to Cloudinary (online cloud storage)
 * - Cloudinary returns a URL (e.g., https://res.cloudinary.com/...)
 * - This URL is stored in MongoDB
 * - Images are NOT saved to public/image or any local folder
 * 
 * Configure Cloudinary - Supports both CLOUDINARY_URL format and individual variables
 * CLOUDINARY_URL format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
 * If CLOUDINARY_URL is set, it will be automatically used
 * Otherwise, use individual environment variables
 */
if (process.env.CLOUDINARY_URL) {
	// Cloudinary SDK automatically reads CLOUDINARY_URL from environment
	cloudinary.config();
} else {
	// Fall back to individual environment variables
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET
	});
}

// Storage for product images (ONLINE - Cloudinary, NOT local folder)
// Images uploaded here go directly to Cloudinary cloud storage
const productStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'ufarm/products', // Cloudinary folder (online)
		allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
		transformation: [{ width: 800, height: 800, crop: 'limit' }]
	}
});

// Storage for profile images (ONLINE - Cloudinary, NOT local folder)
// Images uploaded here go directly to Cloudinary cloud storage
const profileStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'ufarm/profiles', // Cloudinary folder (online)
		allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
		transformation: [{ width: 500, height: 500, crop: 'limit' }]
	}
});

// Create multer instances
const uploadProduct = multer({ 
	storage: productStorage,
	limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadProfile = multer({ 
	storage: profileStorage,
	limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = {
	cloudinary,
	uploadProduct,
	uploadProfile
};

