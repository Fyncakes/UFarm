# Ufarm Installation Guide

## Complete Setup Instructions

### Step 1: System Requirements

Ensure you have the following installed:
- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional, for cloning)

### Step 2: Download/Clone Project

```bash
# If using Git
git clone <repository-url>
cd Ufarm

# Or extract the ZIP file and navigate to the folder
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- express
- mongoose
- passport
- pug
- multer
- and more...

### Step 4: Configure Environment

1. Copy the example environment file:
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

2. Edit `.env` file and update:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/UFarm
   SESSION_SECRET=your_unique_secret_key_here
   ```

### Step 5: Start MongoDB

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or if not installed as service, run:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 6: Create Upload Directories

```bash
# Windows
mkdir public\image
mkdir public\uploads

# Mac/Linux
mkdir -p public/image
mkdir -p public/uploads
```

### Step 7: Run the Application

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### Step 8: Access the Application

Open your web browser and go to:
```
http://localhost:3000
```

## Creating Initial Users

### 1. Register an Agriculture Officer

1. Go to: `http://localhost:3000/Register`
2. Fill in the form:
   - Name: Your name
   - Phone: Your phone number
   - Role: Agriculture Officer (if available) or user
   - User ID: Choose a unique ID
   - Password: Choose a strong password
3. Click "Create Account"

**Note:** If Agriculture Officer is not in the dropdown, you'll need to manually update the user role in MongoDB:

```bash
# Open MongoDB shell
mongosh

# Use the database
use UFarm

# Update user role
db.registrations.updateOne(
  { UserID: "your_user_id" },
  { $set: { role: "Agriculture Officer" } }
)
```

### 2. Register a Farmer

1. Go to: `http://localhost:3000/Register`
2. Choose role: "Urban farmer" or use Farmer One dashboard
3. Complete registration

### 3. Register a Buyer

1. Go to: `http://localhost:3000/Register`
2. Choose role: "Buyer/Customer"
3. Complete registration

## Troubleshooting

### MongoDB Connection Error

**Problem:** Cannot connect to MongoDB

**Solution:**
1. Ensure MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl status mongod
   ```

2. Check connection string in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/UFarm
   ```

### Port Already in Use

**Problem:** Port 3000 is already in use

**Solution:**
1. Change port in `.env`:
   ```env
   PORT=3001
   ```

2. Or stop the other application using port 3000

### Module Not Found Error

**Problem:** Error: Cannot find module

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Or on Windows
rmdir /s node_modules
npm install
```

### File Upload Error

**Problem:** Cannot upload images

**Solution:**
1. Ensure upload directories exist:
   ```bash
   mkdir -p public/image
   mkdir -p public/uploads
   ```

2. Check folder permissions (Mac/Linux):
   ```bash
   chmod 755 public/image
   chmod 755 public/uploads
   ```

### Session Secret Warning

**Problem:** Warning about default secret

**Solution:**
Update `.env` file with a unique secret:
```env
SESSION_SECRET=your_very_long_random_secret_key_12345
```

## Verifying Installation

After installation, verify everything works:

1. ✅ Homepage loads: `http://localhost:3000`
2. ✅ Can register a new user
3. ✅ Can login with registered user
4. ✅ Can view products page
5. ✅ Farmers can upload products
6. ✅ Buyers can add to cart

## Next Steps

1. **Add Sample Data**: Upload some products as a farmer
2. **Test Workflow**: 
   - Farmer uploads product
   - Farmer One/Agric Officer approves
   - Buyer purchases product
3. **Configure Categories**: Create product categories
4. **Customize**: Modify colors, branding, etc.

## Production Deployment

For production deployment, see `README.md` for detailed instructions including:
- Setting up HTTPS
- Using PM2 for process management
- Database backup strategies
- Security hardening

## Support

If you encounter issues not covered here:
1. Check `README.md` for more information
2. Review error messages carefully
3. Ensure all dependencies are installed
4. Verify MongoDB is running

## Quick Start Summary

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Start MongoDB
# (varies by OS - see above)

# 4. Run application
npm run dev

# 5. Open browser
# http://localhost:3000
```

Happy farming! 🌾

