# Ufarm - Complete Website Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Database Models](#database-models)
6. [Routes & Endpoints](#routes--endpoints)
7. [API Documentation](#api-documentation)
8. [Setup & Installation](#setup--installation)
9. [Configuration](#configuration)
10. [Deployment](#deployment)
11. [Security Features](#security-features)
12. [File Structure](#file-structure)
13. [Technologies Used](#technologies-used)
14. [Testing Guide](#testing-guide)
15. [Troubleshooting](#troubleshooting)

---

## Overview

**Ufarm** is a comprehensive e-commerce platform designed to connect farmers, buyers, and sellers in the agricultural marketplace. The platform facilitates the buying and selling of agricultural products, farm equipment, and related services.

### Key Objectives
- Connect Urban Farmers with buyers
- Enable Farmer One Agents to manage and approve farmer products
- Provide Agriculture Officers with platform oversight
- Create a seamless shopping experience for customers
- Support sustainable agriculture practices

### Platform URL
- **Production:** https://ufarm-oig6.onrender.com
- **Development:** http://localhost:3000

---

## Features

### 1. User Authentication & Authorization
- ✅ User registration (Buyers/Customers)
- ✅ Admin registration (Agriculture Officers)
- ✅ Role-based login system
- ✅ Session management
- ✅ Password recovery system
- ✅ JWT authentication for API access
- ✅ Profile management

### 2. Product Management
- ✅ Product upload with images (Cloudinary integration)
- ✅ Product categories (9 predefined categories)
- ✅ Product approval workflow
- ✅ Product editing (returns to pending status)
- ✅ Product status tracking (Pending, Approved, Rejected)
- ✅ Organic product labeling
- ✅ Product search and filtering
- ✅ Category-based product browsing

### 3. Shopping Features
- ✅ Shopping cart functionality
- ✅ Wishlist management
- ✅ Product reviews and ratings
- ✅ Order placement
- ✅ Order tracking
- ✅ Multiple payment methods:
  - Cash on Delivery
  - MTN Mobile Money
  - Airtel Mobile Money
  - Bank Transfer

### 4. Dashboard Features
- ✅ Role-specific dashboards:
  - Agriculture Officer Dashboard
  - Farmer One Agent Dashboard
  - Urban Farmer Dashboard
  - Customer Dashboard
- ✅ Statistics and analytics
- ✅ Clickable dashboard cards
- ✅ Quick navigation

### 5. User Management
- ✅ Farmer verification system
- ✅ User profile management
- ✅ Account deactivation
- ✅ User statistics tracking

### 6. Email Notifications
- ✅ Registration confirmations
- ✅ Order confirmations
- ✅ Password reset emails
- ✅ Order notifications

### 7. REST API
- ✅ Full REST API v1 with JWT authentication
- ✅ Standardized JSON responses
- ✅ API versioning
- ✅ Comprehensive API documentation

---

## Architecture

### Technology Stack

**Backend:**
- Node.js (Runtime)
- Express.js (Web Framework)
- MongoDB (Database)
- Mongoose (ODM)
- Passport.js (Authentication)
- Multer (File Uploads)
- Cloudinary (Image Storage)
- Nodemailer (Email Service)
- JWT (API Authentication)

**Frontend:**
- Pug (Template Engine)
- Bootstrap 5 (CSS Framework)
- Font Awesome 6 (Icons)
- Vanilla JavaScript (Client-side Logic)

**Deployment:**
- Render.com (Hosting)
- MongoDB Atlas (Database - Production)
- Cloudinary (Image CDN)

### Application Flow

```
User Request
    ↓
Express Middleware
    ↓
Authentication Check
    ↓
Route Handler
    ↓
Database Query (MongoDB)
    ↓
Template Rendering (Pug) or JSON Response
    ↓
Response to User
```

---

## User Roles & Permissions

### 1. Customer/Buyer (user)
**Permissions:**
- Browse products
- Add products to cart
- Place orders
- Track orders
- Write reviews
- Manage wishlist
- Update profile
- View product categories

**Restrictions:**
- Cannot upload products
- Cannot approve products
- Cannot access admin dashboards

### 2. Urban Farmer
**Permissions:**
- All customer permissions
- Upload products
- Edit own products
- View own product statistics
- Manage inventory
- View orders for their products
- Update profile with farm details

**Restrictions:**
- Products require approval before public display
- Cannot approve products
- Cannot register other users

### 3. Farmer One Agent
**Permissions:**
- All customer permissions
- Register Urban Farmers
- Review products from registered farmers
- Approve/reject products
- View registered farmers list
- View product statistics
- Access Farmer One dashboard

**Restrictions:**
- Can only manage farmers they registered
- Cannot register other agents
- Cannot access Agriculture Officer features

### 4. Agriculture Officer (Admin)
**Permissions:**
- Full platform access
- Verify/unverify farmers
- Approve/reject all products
- View all users (farmers, buyers, agents)
- Manage categories
- View all statistics
- Register Farmer One agents
- Deactivate user accounts
- Access all dashboards

**Restrictions:**
- None (full administrative access)

---

## Database Models

### 1. User/Registration Model
**Collection:** `registrations`

**Fields:**
- `Name1` (String, required, unique) - Username
- `email` (String, sparse) - Email address
- `phonenumber` (String, required) - Phone number
- `role` (String, enum) - User role
- `Gender1` (String, enum) - Gender
- `verified` (Boolean) - Verification status
- `active` (Boolean) - Account status
- `profileImage` (String) - Cloudinary URL
- `bio` (String) - User bio
- `rating` (Number) - User rating
- `farmSize`, `farmType`, `farmLocation` - Farmer-specific fields
- `address`, `district`, `village` - Location fields
- `resetPasswordToken` (String) - Password reset token
- `resetPasswordExpires` (Date) - Token expiration
- `registeredBy` (ObjectId) - Farmer One who registered this user
- `totalSales`, `totalOrders` - Statistics
- `timestamps` - Created/Updated dates

### 2. Product/Upload Model
**Collection:** `uploads`

**Fields:**
- `productName` (String, required) - Product name
- `description` (String) - Product description
- `category` (ObjectId, ref: Category) - Product category
- `price` (Number, required) - Product price
- `quantity` (Number, required) - Available quantity
- `image` (String, required) - Cloudinary URL
- `owner` (ObjectId, ref: Registration) - Product owner
- `owner_name` (String) - Owner name
- `direction` (String) - Location/direction
- `organic` (Boolean) - Organic status
- `status` (String, enum: pending/approved/rejected) - Approval status
- `timestamps` - Created/Updated dates

### 3. Category Model
**Collection:** `categories`

**Fields:**
- `name` (String, required, unique) - Category name
- `description` (String) - Category description
- `icon` (String) - Font Awesome icon class
- `slug` (String, unique) - URL-friendly slug
- `image` (String) - Category image
- `active` (Boolean) - Active status
- `timestamps` - Created/Updated dates

**Predefined Categories:**
1. Seedlings
2. Machinery
3. Plants
4. Organic Fertilizers
5. Farm Tools
6. Fresh Produce
7. Livestock & Poultry
8. Herbs & Spices
9. Others

### 4. Cart Model
**Collection:** `carts`

**Fields:**
- `user` (ObjectId, ref: Registration) - Cart owner
- `items` (Array) - Cart items
  - `product` (ObjectId, ref: Upload)
  - `productName` (String)
  - `price` (Number)
  - `quantity` (Number)
  - `image` (String)
  - `seller` (ObjectId, ref: Registration)
  - `seller_name` (String)
- `totalPrice` (Number) - Total cart value
- `totalItems` (Number) - Total items count
- `timestamps` - Created/Updated dates

**Methods:**
- `calculateTotals()` - Calculate cart totals

### 5. Order Model
**Collection:** `orders`

**Fields:**
- `orderNumber` (String, unique) - Order identifier
- `buyer` (ObjectId, ref: Registration) - Order buyer
- `buyer_name` (String) - Buyer name
- `buyer_phone` (String) - Buyer phone
- `items` (Array) - Order items
  - `product` (ObjectId, ref: Upload)
  - `productName` (String)
  - `price` (Number)
  - `quantity` (Number)
  - `image` (String)
  - `seller` (ObjectId, ref: Registration)
  - `seller_name` (String)
- `totalPrice` (Number) - Order total
- `deliveryAddress` (String, required) - Delivery address
- `deliveryLocation` (String) - Delivery location
- `paymentMethod` (String, enum) - Payment method
- `mobileMoneyPhone` (String) - Mobile money number
- `paymentStatus` (String, enum: pending/paid/failed)
- `orderStatus` (String, enum) - Order status
- `notes` (String) - Order notes
- `cancelReason` (String) - Cancellation reason
- `timestamps` - Created/Updated dates

### 6. Wishlist Model
**Collection:** `wishlists`

**Fields:**
- `user` (ObjectId, ref: Registration) - Wishlist owner
- `items` (Array) - Wishlist items
  - `product` (ObjectId, ref: Upload)
  - `addedAt` (Date)
- `timestamps` - Created/Updated dates

### 7. Review Model
**Collection:** `reviews`

**Fields:**
- `user` (ObjectId, ref: Registration) - Reviewer
- `product` (ObjectId, ref: Upload) - Reviewed product
- `rating` (Number, 1-5) - Rating
- `comment` (String) - Review comment
- `timestamps` - Created/Updated dates

### 8. Testimonial Model
**Collection:** `testimonials`

**Fields:**
- `user` (ObjectId, ref: Registration) - Testimonial author
- `userName` (String) - Author name
- `rating` (Number, 1-5) - Rating
- `comment` (String) - Testimonial text
- `approved` (Boolean) - Approval status
- `featured` (Boolean) - Featured status
- `timestamps` - Created/Updated dates

---

## Routes & Endpoints

### Authentication Routes (`/routers/authRoutes.js`)
- `GET /login` - Login page
- `POST /login` - Process login
- `POST /logout` - Logout user

### Registration Routes (`/routers/SignupRoutes.js`)
- `GET /Register` - Registration page
- `POST /Register` - Process registration (buyers only)

### Admin Routes (`/app.js`)
- `GET /admin/register` - Admin registration page
- `POST /admin/register` - Process admin registration

### Password Reset Routes (`/routers/passwordResetRouter.js`)
- `GET /forgot-password` - Forgot password page
- `POST /forgot-password` - Send reset email
- `GET /reset-password/:token` - Reset password page
- `POST /reset-password/:token` - Process password reset

### Product Routes (`/routers/produceRouter.js`)
- `GET /product` - List all approved products
- `GET /product-detail/:id` - Product details
- `POST /uploadsList` - Upload product (legacy route)

### Urban Farmer Routes (`/routers/urbanRoutes.js`)
- `GET /UB` - Urban Farmer dashboard
- `GET /add-product` - Add product form
- `POST /uploads` - Upload new product
- `GET /my-products` - My products list
- `GET /edit-product/:id` - Edit product form
- `POST /update-product/:id` - Update product
- `DELETE /delete-product/:id` - Delete product
- `GET /farmer-orders` - Farmer orders

### Farmer One Routes (`/routers/farmeroneRouters.js`)
- `GET /FO` - Farmer One dashboard
- `POST /FO` - Register new farmer
- `GET /FO/review-products` - Review products
- `GET /FO/my-farmers` - My registered farmers
- `GET /FO/products` - View products with filters

### Agriculture Officer Routes (`/routers/agricRouter.js`)
- `GET /OA` - Agriculture Officer dashboard
- `GET /OA/farmers` - All farmers list
- `GET /OA/buyers` - All buyers list
- `GET /OA/products` - All products (with filters)
- `GET /OA/all-products` - All products (unfiltered)
- `GET /OA/orders` - All orders
- `GET /OA/agents` - All Farmer One agents
- `POST /OA/farmer/:id/verify` - Verify farmer
- `POST /OA/farmer/:id/reject` - Unverify farmer
- `POST /OA/approve-product` - Approve product
- `GET /OA/reject-product/:id` - Reject product
- `POST /OA/register-agent` - Register Farmer One agent
- `POST /OA/user/:id/deactivate` - Deactivate user

### Cart Routes (`/routers/cartRouter.js`)
- `GET /cart` - View cart
- `POST /cart/add` - Add to cart
- `POST /cart/update/:itemId` - Update cart item
- `POST /cart/remove/:itemId` - Remove from cart
- `POST /cart/clear` - Clear cart

### Order Routes (`/routers/orderRouter.js`)
- `GET /checkout` - Checkout page
- `POST /order/place` - Place order
- `GET /orders` - User orders
- `GET /order/:id` - Order details
- `POST /order/:id/update` - Update order
- `POST /order/:id/cancel` - Cancel order

### Category Routes (`/routers/categoryRouter.js`)
- `GET /categories` - All categories
- `GET /category/:slug` - Category products
- `POST /category/add` - Add category (Admin)
- `POST /category/:id/update` - Update category (Admin)
- `POST /category/:id/delete` - Delete category (Admin)

### Profile Routes (`/routers/profileRouter.js`)
- `GET /profile` - Own profile
- `GET /profile/:id` - View other user's profile
- `POST /profile/update` - Update profile
- `POST /profile/change-password` - Change password

### Wishlist Routes (`/routers/wishlistRouter.js`)
- `GET /wishlist` - View wishlist
- `POST /wishlist/add` - Add to wishlist
- `POST /wishlist/remove/:productId` - Remove from wishlist

### Review Routes (`/routers/reviewRouter.js`)
- `POST /product/:id/review` - Submit review
- `GET /product/:id/reviews` - Get reviews (JSON)
- `POST /review/:id/delete` - Delete review

### Testimonial Routes (`/routers/testimonialRouter.js`)
- `POST /testimonial/submit` - Submit testimonial
- `GET /testimonials` - Get testimonials (JSON)

### Static Pages (`/app.js`)
- `GET /` - Home page
- `GET /about` - About page
- `GET /terms` - Terms and Conditions
- `GET /join-requirements` - Join requirements

---

## API Documentation

### REST API v1 (`/api/v1`)

**Base URL:**
- Development: `http://localhost:3000/api/v1`
- Production: `https://ufarm-oig6.onrender.com/api/v1`

**Authentication:**
- JWT token required for protected endpoints
- Header format: `Authorization: Bearer <token>`

### Authentication Endpoints
- `POST /api/v1/auth/login` - Login and get token
- `POST /api/v1/auth/register` - Register new user
- `GET /api/v1/auth/me` - Get current user profile

### Products Endpoints
- `GET /api/v1/products` - List products (public)
- `GET /api/v1/products/:id` - Get product (public)
- `POST /api/v1/products` - Create product (Urban Farmer)
- `PUT /api/v1/products/:id` - Update product (Owner)
- `DELETE /api/v1/products/:id` - Delete product (Owner)

### Cart Endpoints
- `GET /api/v1/cart` - Get cart (requires auth)
- `POST /api/v1/cart/add` - Add to cart (requires auth)
- `PUT /api/v1/cart/update/:itemId` - Update cart (requires auth)
- `DELETE /api/v1/cart/remove/:itemId` - Remove item (requires auth)
- `DELETE /api/v1/cart/clear` - Clear cart (requires auth)

### Orders Endpoints
- `GET /api/v1/orders` - Get orders (requires auth)
- `GET /api/v1/orders/:id` - Get order (requires auth)
- `POST /api/v1/orders` - Place order (requires auth)
- `PUT /api/v1/orders/:id/cancel` - Cancel order (requires auth)

### Categories Endpoints
- `GET /api/v1/categories` - List categories (public)
- `GET /api/v1/categories/:id` - Get category (public)
- `GET /api/v1/categories/:id/products` - Category products (public)

**For detailed API documentation, see `API_DOCUMENTATION.md` and `API_TEST_GUIDE.md`**

---

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Ufarm
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
# Database Configuration
database=mongodb://localhost:27017/UFarm

# Session Secret
secret=your-session-secret-key-here

# JWT Configuration (for REST API)
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Port (Optional)
PORT=3000
NODE_ENV=development
```

4. **Start MongoDB**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

5. **Seed Categories (Optional)**
```bash
node seedCategories.js
```

6. **Run the application**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

7. **Access the application**
```
http://localhost:3000
```

### Create Admin Account

**Option 1: Web Interface**
- Navigate to `/admin/register`
- Fill in the registration form
- Submit to create Agriculture Officer account

**Option 2: Script**
```bash
node createAdmin.js
```

Default credentials (if using script):
- Username: `admin`
- Password: `admin123`
- **Change immediately after first login!**

---

## Configuration

### Environment Variables

**Required:**
- `database` - MongoDB connection string
- `secret` - Session secret key

**Optional:**
- `JWT_SECRET` - JWT token secret (for API)
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `EMAIL_SERVICE` - Email service provider
- `EMAIL_USER` - Email address
- `EMAIL_PASSWORD` - Email password/app password
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Cloudinary Configuration

**Required for image uploads:**
- `CLOUDINARY_URL` or individual variables:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

**Storage:**
- All user-uploaded images stored in Cloudinary (online)
- Images NOT stored locally
- Cloudinary URLs saved in MongoDB

### Email Configuration

**Gmail Setup:**
1. Enable 2-factor authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use 16-character password in `.env`

**Note:** Email is optional. System works without email configuration.

---

## Deployment

### Render.com Deployment

**Steps:**
1. Push code to GitHub repository
2. Connect repository to Render.com
3. Configure environment variables in Render dashboard
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Enable auto-deploy

**Required Environment Variables on Render:**
- `database` - MongoDB Atlas connection string
- `secret` - Session secret
- `JWT_SECRET` - JWT secret
- `CLOUDINARY_URL` - Cloudinary credentials
- `EMAIL_USER`, `EMAIL_PASSWORD` - Email credentials (optional)

**MongoDB Atlas Setup:**
1. Create cluster on MongoDB Atlas
2. Create database user
3. Whitelist Render.com IP (or 0.0.0.0/0 for all)
4. Get connection string
5. Add to Render environment variables

**See `RENDER_DEPLOYMENT_GUIDE.md` for detailed instructions**

---

## Security Features

### Authentication & Authorization
- ✅ Password hashing (bcrypt via passport-local-mongoose)
- ✅ Session-based authentication
- ✅ JWT tokens for API access
- ✅ Role-based access control (RBAC)
- ✅ Password reset with secure tokens
- ✅ Token expiration (1 hour for password reset, 7 days for JWT)

### Data Protection
- ✅ Input validation
- ✅ SQL injection prevention (Mongoose)
- ✅ XSS protection (Pug templating)
- ✅ CSRF protection (connect-flash)
- ✅ Secure password storage
- ✅ Sensitive data excluded from API responses

### File Upload Security
- ✅ File type validation
- ✅ File size limits
- ✅ Cloudinary secure storage
- ✅ No local file storage

### Best Practices
- ✅ Environment variables for secrets
- ✅ Error messages don't reveal sensitive info
- ✅ Secure session configuration
- ✅ Password complexity requirements

---

## File Structure

```
Ufarm/
├── config/
│   ├── db.js              # Database configuration
│   ├── passport.js        # Passport authentication
│   ├── cloudinary.js      # Cloudinary image storage
│   ├── email.js           # Email service & templates
│   └── jwt.js             # JWT configuration
├── middleware/
│   ├── apiAuth.js         # API authentication middleware
│   └── apiResponse.js     # Standardized API responses
├── models/
│   ├── User.js            # User/Registration model
│   ├── Upload.js          # Product model
│   ├── Category.js        # Category model
│   ├── Cart.js            # Shopping cart model
│   ├── Order.js           # Order model
│   ├── Wishlist.js        # Wishlist model
│   ├── Review.js          # Review model
│   └── Testimonial.js     # Testimonial model
├── routers/
│   ├── authRoutes.js      # Authentication routes
│   ├── SignupRoutes.js    # Registration routes
│   ├── passwordResetRouter.js  # Password reset routes
│   ├── urbanRoutes.js     # Urban farmer routes
│   ├── farmeroneRouters.js # Farmer One routes
│   ├── agricRouter.js     # Agriculture Officer routes
│   ├── produceRouter.js   # Product routes
│   ├── cartRouter.js      # Cart routes
│   ├── orderRouter.js     # Order routes
│   ├── categoryRouter.js  # Category routes
│   ├── profileRouter.js   # Profile routes
│   ├── wishlistRouter.js  # Wishlist routes
│   ├── reviewRouter.js    # Review routes
│   ├── testimonialRouter.js # Testimonial routes
│   └── api/
│       └── v1/
│           ├── index.js   # API router index
│           ├── authApi.js # API authentication
│           ├── productsApi.js # API products
│           ├── cartApi.js # API cart
│           ├── ordersApi.js # API orders
│           └── categoriesApi.js # API categories
├── views/
│   ├── includes/
│   │   ├── navbar.pug     # Navigation bar
│   │   ├── footer.pug     # Footer
│   │   ├── flash-messages.pug # Flash messages
│   │   └── back-button.pug # Back button component
│   ├── home.pug           # Home page
│   ├── Login.pug          # Login page
│   ├── Signup.pug         # Registration page
│   ├── forgotPassword.pug # Forgot password page
│   ├── resetPassword.pug  # Reset password page
│   ├── profile.pug        # Profile page
│   ├── productList.pug    # Product listing
│   ├── product-detail.pug # Product details
│   ├── addProduct.pug     # Add product form
│   ├── editProduct.pug    # Edit product form
│   ├── myProducts.pug     # My products list
│   ├── cart.pug           # Shopping cart
│   ├── checkout.pug       # Checkout page
│   ├── orders.pug         # Orders list
│   ├── orderDetail.pug    # Order details
│   ├── wishlist.pug       # Wishlist
│   ├── categories.pug     # Categories page
│   ├── categoryProducts.pug # Category products
│   ├── agricDashboard.pug # Agriculture Officer dashboard
│   ├── agricFarmers.pug   # Farmers list (Admin)
│   ├── agricProducts.pug  # Products list (Admin)
│   ├── farmerone.pug      # Farmer One dashboard
│   ├── Urban.pug          # Urban Farmer dashboard
│   ├── About_us.pug       # About page
│   ├── terms-and-conditions.pug # Terms page
│   ├── joinRequirements.pug # Join requirements
│   ├── admin-register.pug # Admin registration
│   ├── 404.pug            # 404 error page
│   └── error.pug          # Error page
├── public/
│   ├── css/
│   │   ├── main.css       # Main stylesheet
│   │   ├── login.css      # Login page styles
│   │   └── profile.css    # Profile page styles
│   ├── js/
│   │   ├── form_val.js    # Form validation
│   │   ├── profile.js     # Profile page scripts
│   │   └── products.js    # Product page scripts
│   ├── image/             # Static images (demo/placeholder)
│   └── uploads/           # Temporary uploads (not used in production)
├── app.js                 # Main application file
├── package.json           # Dependencies
├── seedCategories.js      # Category seeding script
├── createAdmin.js         # Admin creation script
├── .env                   # Environment variables (not in git)
├── .gitignore            # Git ignore rules
├── README.md             # Basic readme
├── API_DOCUMENTATION.md  # API documentation
├── API_TEST_GUIDE.md    # API testing guide
├── ENV_SETUP.md         # Environment setup guide
├── RENDER_DEPLOYMENT_GUIDE.md # Deployment guide
└── WEBSITE_DOCUMENTATION.md   # This file
```

---

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **passport-local-mongoose** - Local authentication strategy
- **express-session** - Session management
- **connect-flash** - Flash messages
- **multer** - File upload handling
- **multer-storage-cloudinary** - Cloudinary storage
- **cloudinary** - Image CDN service
- **nodemailer** - Email service
- **jsonwebtoken** - JWT token generation
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **express-validator** - Input validation
- **method-override** - HTTP method override

### Frontend
- **Pug** - Template engine
- **Bootstrap 5** - CSS framework
- **Font Awesome 6** - Icon library
- **Vanilla JavaScript** - Client-side scripting

### Development Tools
- **nodemon** - Development auto-reload
- **Git** - Version control

---

## Testing Guide

### Manual Testing

**1. User Registration**
- Navigate to `/Register`
- Fill in registration form
- Submit and verify account creation
- Check email confirmation (if configured)

**2. Login**
- Navigate to `/login`
- Enter credentials
- Verify redirect to appropriate dashboard

**3. Password Recovery**
- Click "Forgot password?" on login page
- Enter email address
- Check email for reset link
- Click link and reset password
- Login with new password

**4. Product Upload (Urban Farmer)**
- Login as Urban Farmer
- Navigate to "Add Product"
- Fill in product form
- Upload image
- Select category
- Submit product
- Verify product appears in "My Products" with "Pending" status

**5. Product Approval (Farmer One/Admin)**
- Login as Farmer One or Admin
- Navigate to products list
- Review pending products
- Approve or reject products
- Verify status changes

**6. Shopping Flow**
- Browse products
- Add products to cart
- View cart
- Proceed to checkout
- Select payment method
- Place order
- Verify order confirmation

**7. API Testing**
- Use Postman or curl
- Test authentication endpoints
- Test protected endpoints with JWT token
- Verify JSON responses

**See `API_TEST_GUIDE.md` for detailed API testing instructions**

---

## Troubleshooting

### Common Issues

**1. Server Won't Start**
```bash
# Check if port is in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # macOS/Linux

# Kill process if needed
taskkill /PID <PID> /F         # Windows
kill -9 <PID>                  # macOS/Linux
```

**2. Database Connection Error**
- Verify MongoDB is running
- Check connection string in `.env`
- Verify database name: `UFarm`
- Check network connectivity (for MongoDB Atlas)

**3. Images Not Uploading**
- Verify Cloudinary credentials in `.env`
- Check `CLOUDINARY_URL` format
- Verify file size limits
- Check file type restrictions

**4. Email Not Sending**
- Verify email credentials in `.env`
- Check Gmail app password (if using Gmail)
- Verify email service configuration
- Check console logs for errors
- **Note:** Email is optional - system works without it

**5. Categories Not Showing**
- Run category seeding script: `node seedCategories.js`
- Check database for categories
- Verify category `active` status
- Clear browser cache

**6. Password Reset Not Working**
- Verify email configuration
- Check token expiration (1 hour)
- Verify reset link format
- Check email spam folder

**7. API Authentication Failing**
- Verify JWT_SECRET in `.env`
- Check token expiration
- Verify Authorization header format: `Bearer <token>`
- Check token validity

### Debug Mode

Enable detailed logging:
```javascript
// In app.js, add:
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Database Queries

**Check users:**
```javascript
// In MongoDB shell or Compass
db.registrations.find()
```

**Check products:**
```javascript
db.uploads.find()
```

**Check categories:**
```javascript
db.categories.find()
```

---

## Feature Details

### Product Approval Workflow

1. **Urban Farmer uploads product**
   - Status: `pending`
   - Not visible to public

2. **Farmer One/Admin reviews**
   - Can approve → Status: `approved` (visible)
   - Can reject → Status: `rejected` (hidden)

3. **Product editing**
   - When edited, status returns to `pending`
   - Requires re-approval

### Order Processing Flow

1. **Customer places order**
   - Order created with `pending` status
   - Product quantity reduced
   - Cart cleared

2. **Order statuses:**
   - `pending` - Order placed
   - `processing` - Being prepared
   - `shipped` - In transit
   - `delivered` - Completed
   - `cancelled` - Cancelled

3. **Payment statuses:**
   - `pending` - Awaiting payment
   - `paid` - Payment received
   - `failed` - Payment failed

### Category System

- **9 Predefined Categories:**
  1. Seedlings
  2. Machinery
  3. Plants
  4. Organic Fertilizers
  5. Farm Tools
  6. Fresh Produce
  7. Livestock & Poultry
  8. Herbs & Spices
  9. Others

- **Auto-seeding:** Categories automatically created if missing
- **Category Pages:** Show only approved products
- **Filtering:** Products can be filtered by category

### Image Upload System

- **Storage:** Cloudinary (online CDN)
- **Process:**
  1. User selects image
  2. Image preview shown immediately (client-side)
  3. On form submit, image uploaded to Cloudinary
  4. Cloudinary URL saved in MongoDB
  5. Image displayed from Cloudinary URL

- **Features:**
  - Image preview before upload
  - File type validation
  - File size limits
  - Mobile camera support
  - Drag-and-drop support

### Mobile Money Integration

- **Supported Providers:**
  - MTN Mobile Money
  - Airtel Mobile Money

- **Process:**
  1. Customer selects mobile money payment
  2. Enters phone number
  3. Phone number validated (9-10 digits)
  4. Phone number saved with order
  5. Payment status set to `pending`

---

## Performance Considerations

### Optimization Strategies
- ✅ Database indexing on frequently queried fields
- ✅ Image optimization via Cloudinary
- ✅ Static file caching
- ✅ Session management optimization
- ✅ Pagination for product lists
- ✅ Lazy loading for images

### Recommended Improvements
- [ ] Add Redis for session storage
- [ ] Implement CDN for static assets
- [ ] Add database query optimization
- [ ] Implement caching layer
- [ ] Add rate limiting
- [ ] Optimize image sizes

---

## Future Enhancements

### Planned Features
- [ ] Advanced search with filters
- [ ] Product recommendations
- [ ] Seller ratings and reviews
- [ ] Order tracking with updates
- [ ] Payment gateway integration
- [ ] SMS notifications
- [ ] Mobile app API
- [ ] Analytics dashboard
- [ ] Bulk product upload
- [ ] Product variants (sizes, colors)
- [ ] Discount/coupon system
- [ ] Multi-language support

---

## Support & Contact

### Documentation Files
- `README.md` - Basic setup guide
- `API_DOCUMENTATION.md` - Complete API reference
- `API_TEST_GUIDE.md` - API testing instructions
- `ENV_SETUP.md` - Environment configuration
- `RENDER_DEPLOYMENT_GUIDE.md` - Deployment guide
- `ADMIN_SETUP.md` - Admin account setup
- `WEBSITE_DOCUMENTATION.md` - This comprehensive guide

### Getting Help
- Check troubleshooting section above
- Review error logs in console
- Check GitHub issues
- Contact support: support@ufarm.com

---

## License

MIT License - See LICENSE file for details

---

## Version History

**Current Version:** 1.0.0

**Recent Updates:**
- ✅ REST API v1 implementation
- ✅ Password recovery system
- ✅ Category system with auto-seeding
- ✅ Profile viewing by ID
- ✅ Mobile money payment options
- ✅ Enhanced image upload with preview
- ✅ Product editing workflow
- ✅ Dashboard interactivity
- ✅ WhatsApp integration

---

**Last Updated:** 2024
**Documentation Version:** 1.0.0

---

*This documentation is maintained to reflect the current state of the Ufarm platform. For the most up-to-date information, refer to the codebase and other documentation files.*

