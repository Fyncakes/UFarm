# Agriculture Officer Admin Account Setup

This guide explains how to create an Agriculture Officer admin account in MongoDB Atlas.

## 📋 Prerequisites

- Node.js installed
- MongoDB Atlas connection string configured in `.env`
- All dependencies installed (`npm install`)

## 🚀 Creating Admin Account

### Method 1: Using the Script (Recommended)

1. **Ensure your `.env` file has the MongoDB connection string:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/UFarm
   SESSION_SECRET=your-secret-key
   ```

2. **Run the admin creation script:**
   ```bash
   node createAdmin.js
   ```

3. **The script will:**
   - Connect to MongoDB Atlas
   - Check if admin account already exists
   - Create a new Agriculture Officer account if it doesn't exist
   - Display the login credentials

### Default Admin Credentials

After running the script, you'll get:
- **Username:** `admin`
- **Password:** `Admin@2024`
- **Role:** `Agriculture Officer`
- **Email:** `admin@ufarm.com`

⚠️ **IMPORTANT:** Change the password immediately after first login!

## 🔐 Login

1. Go to: `https://ufarm-oig6.onrender.com/login` (or `http://localhost:3000/login` for local)
2. Enter username: `admin`
3. Enter password: `Admin@2024`
4. Click "Login"

## ✏️ Customizing Admin Details

To create an admin with different credentials, edit `createAdmin.js`:

```javascript
const adminDetails = {
	Name1: 'your-username',        // Change username
	email: 'your-email@ufarm.com',  // Change email
	phonenumber: '+256700000000',   // Change phone
	// ... other fields
};

const adminPassword = 'YourSecurePassword123!'; // Change password
```

Then run: `node createAdmin.js`

## 🔍 Verifying Admin Account

To verify the admin account was created:

1. **Check MongoDB Atlas:**
   - Go to your MongoDB Atlas cluster
   - Browse Collections → `registrations`
   - Find document with `Name1: "admin"` and `role: "Agriculture Officer"`

2. **Or use MongoDB Compass:**
   - Connect to your cluster
   - Navigate to `UFarm` database → `registrations` collection
   - Search for `{ "role": "Agriculture Officer" }`

## 🛠️ Troubleshooting

### Error: "Admin account already exists"
- The username already exists in the database
- Either use a different username or delete the existing account first

### Error: "MongoDB connection failed"
- Check your `.env` file has the correct `MONGODB_URI`
- Verify MongoDB Atlas network access allows your IP (or 0.0.0.0/0 for all)
- Check your MongoDB Atlas username and password are correct

### Error: "Username already exists"
- The username is already taken
- Choose a different username in `createAdmin.js`

## 📝 Notes

- The admin account is created with `verified: true` and `active: true`
- The password is hashed using bcrypt (via passport-local-mongoose)
- Only one admin account can exist with the same username
- Agriculture Officers have full platform access and can:
  - Register Farmer One Agents
  - Approve/reject products
  - View all users and statistics
  - Manage the entire platform

## 🔄 Creating Additional Admins

To create additional Agriculture Officer accounts:

1. Edit `createAdmin.js` with new credentials
2. Run `node createAdmin.js` again
3. Or use the Agriculture Officer dashboard to register Farmer One Agents (who can then register Urban Farmers)

---

**Need Help?** Check the main README.md or contact support.

