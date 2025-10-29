require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for product images
const productStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'ufarm/products',
		allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
		transformation: [{ width: 800, height: 800, crop: 'limit' }]
	}
});

// Storage for profile images
const profileStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'ufarm/profiles',
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

