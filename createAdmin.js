/**
 * Script to create Agriculture Officer Admin Account
 * Run this script to create an admin account in MongoDB Atlas
 * 
 * Usage: node createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Registration = require('./models/User');
const config = require('./config/db');

// Admin account details
const adminDetails = {
	Name1: 'admin',
	role: 'Agriculture Officer',
	email: 'admin@ufarm.com',
	phonenumber: '+256700000000',
	Gender1: 'Male',
	verified: true,
	active: true,
	district: 'Kampala',
	address: 'Kampala, Uganda',
	bio: 'System Administrator for Ufarm Platform'
};

// Password for admin account
const adminPassword = 'Admin@2024'; // CHANGE THIS PASSWORD AFTER FIRST LOGIN!

async function createAdmin() {
	try {
		// Connect to MongoDB
		console.log('Connecting to MongoDB...');
		await mongoose.connect(config.database, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('✅ Connected to MongoDB successfully');

		// Check if admin already exists
		const existingAdmin = await Registration.findOne({ Name1: adminDetails.Name1 });
		if (existingAdmin) {
			console.log('⚠️  Admin account already exists!');
			console.log(`   Username: ${adminDetails.Name1}`);
			console.log(`   Role: ${existingAdmin.role}`);
			console.log(`   Email: ${existingAdmin.email || 'Not set'}`);
			console.log('\n❌ To create a new admin, use a different username or delete the existing account.');
			process.exit(0);
		}

		// Create new admin account
		console.log('\nCreating Agriculture Officer admin account...');
		const admin = new Registration(adminDetails);

		// Register admin with password using passport-local-mongoose
		await Registration.register(admin, adminPassword, async (error) => {
			if (error) {
				console.error('❌ Error creating admin account:', error);
				if (error.name === 'UserExistsError') {
					console.error('   Username already exists. Please choose a different username.');
				}
				process.exit(1);
			}

			console.log('\n✅ Admin account created successfully!');
			console.log('\n📋 Account Details:');
			console.log('   Username: ' + adminDetails.Name1);
			console.log('   Password: ' + adminPassword);
			console.log('   Role: ' + adminDetails.role);
			console.log('   Email: ' + adminDetails.email);
			console.log('   Phone: ' + adminDetails.phonenumber);
			console.log('\n⚠️  IMPORTANT: Change the password after first login!');
			console.log('\n🔗 Login URL: https://ufarm-oig6.onrender.com/login');
			console.log('   (or http://localhost:3000/login for local development)');
			
			// Close connection
			mongoose.connection.close();
			console.log('\n✅ Database connection closed.');
			process.exit(0);
		});
	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

// Run the script
console.log('🚀 Ufarm Admin Account Creator');
console.log('================================\n');
createAdmin();

