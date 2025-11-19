# Ufarm API Documentation

## Overview

Ufarm is a web application built with Express.js that uses **server-side rendering (SSR)** with Pug templates. Most endpoints render HTML pages, but some can also return JSON data.

**Base URL:** `https://ufarm-oig6.onrender.com` (Production) or `http://localhost:3000` (Development)

---

## API Architecture

The application uses **Express.js routes** organized into separate router files. Routes are registered in `app.js` and handle both:
- **HTML Rendering** (Pug templates) - Most routes
- **JSON Responses** - Some endpoints (testimonials, etc.)

---

## Authentication Endpoints

### Login
- **GET** `/login` - Display login page
- **POST** `/login` - Authenticate user
  - **Body:** `{ username, password }`
  - **Response:** Redirects to dashboard or home

### Logout
- **POST** `/logout` - Logout user
  - **Response:** Redirects to home page

### Registration
- **GET** `/Register` - Display registration page
- **POST** `/Register` - Register new user (buyer/customer only)
  - **Body:** `{ Name1, email, phonenumber, password, role: "user" }`
  - **Response:** Redirects to login page

### Admin Registration
- **GET** `/admin/register` - Display admin registration page
- **POST** `/admin/register` - Register Agriculture Officer
  - **Body:** `{ Name1, email, phonenumber, password, role: "Agriculture Officer", ... }`
  - **Response:** Redirects to login page

---

## Product Endpoints

### Browse Products
- **GET** `/product` - List all approved products
  - **Response:** Renders `productList.pug` with products
  - **Query Params:** None (filtering can be added)

### Product Details
- **GET** `/product-detail/:id` - View single product details
  - **Params:** `id` - Product MongoDB ID
  - **Response:** Renders `product-detail.pug`

### Upload Product (Urban Farmer)
- **GET** `/add-product` - Display product upload form
  - **Auth:** Required (Urban Farmer)
  - **Response:** Renders `addProduct.pug` with categories
- **POST** `/uploads` - Upload new product
  - **Auth:** Required (Urban Farmer)
  - **Body:** `{ productName, category, price, quantity, description, direction, organic, image }`
  - **Content-Type:** `multipart/form-data`
  - **Response:** Redirects to `/my-products`

### Edit Product
- **GET** `/edit-product/:id` - Display product edit form
  - **Auth:** Required (Product owner)
  - **Params:** `id` - Product MongoDB ID
  - **Response:** Renders `editProduct.pug`
- **POST** `/update-product/:id` - Update product
  - **Auth:** Required (Product owner)
  - **Body:** `{ productName, category, price, quantity, description, direction, organic, image? }`
  - **Content-Type:** `multipart/form-data`
  - **Response:** Redirects to `/my-products`

### Delete Product
- **DELETE** `/delete-product/:id` - Delete product
  - **Auth:** Required (Product owner)
  - **Params:** `id` - Product MongoDB ID
  - **Response:** JSON `{ message: "Product deleted" }`

### My Products
- **GET** `/my-products` - List user's products
  - **Auth:** Required (Urban Farmer)
  - **Query Params:** `?filter=all|approved|pending|rejected`
  - **Response:** Renders `myProducts.pug`

---

## Shopping Cart Endpoints

### View Cart
- **GET** `/cart` - Display shopping cart
  - **Auth:** Required
  - **Response:** Renders `cart.pug`

### Add to Cart
- **POST** `/cart/add` - Add product to cart
  - **Auth:** Required
  - **Body:** `{ productId, quantity }`
  - **Response:** Redirects to `/cart`

### Update Cart Item
- **POST** `/cart/update/:itemId` - Update cart item quantity
  - **Auth:** Required
  - **Params:** `itemId` - Cart item MongoDB ID
  - **Body:** `{ quantity }`
  - **Response:** Redirects to `/cart`

### Remove from Cart
- **POST** `/cart/remove/:itemId` - Remove item from cart
  - **Auth:** Required
  - **Params:** `itemId` - Cart item MongoDB ID
  - **Response:** Redirects to `/cart`

### Clear Cart
- **POST** `/cart/clear` - Clear all items from cart
  - **Auth:** Required
  - **Response:** Redirects to `/cart`

---

## Order Endpoints

### Checkout
- **GET** `/checkout` - Display checkout page
  - **Auth:** Required
  - **Response:** Renders `checkout.pug`

### Place Order
- **POST** `/order/place` - Create new order
  - **Auth:** Required
  - **Body:** 
    ```json
    {
      "deliveryAddress": "string (required)",
      "deliveryLocation": "string (optional)",
      "paymentMethod": "cash_on_delivery|mtn_mobile_money|airtel_mobile_money|bank_transfer",
      "mobileMoneyPhone": "string (required if mobile money)",
      "notes": "string (optional)"
    }
    ```
  - **Response:** Redirects to `/orders`

### View Orders
- **GET** `/orders` - List user's orders
  - **Auth:** Required
  - **Response:** Renders `orders.pug`

### Order Details
- **GET** `/order/:id` - View single order details
  - **Auth:** Required
  - **Params:** `id` - Order MongoDB ID
  - **Response:** Renders `orderDetail.pug`

### Update Order
- **POST** `/order/:id/update` - Update order status
  - **Auth:** Required (Seller/Admin)
  - **Body:** `{ orderStatus, paymentStatus, deliveryDate }`
  - **Response:** Redirects to order details

### Cancel Order
- **POST** `/order/:id/cancel` - Cancel order
  - **Auth:** Required (Buyer)
  - **Body:** `{ cancelReason }`
  - **Response:** Redirects to orders list

---

## Wishlist Endpoints

### View Wishlist
- **GET** `/wishlist` - Display user's wishlist
  - **Auth:** Required
  - **Response:** Renders `wishlist.pug`

### Add to Wishlist
- **POST** `/wishlist/add` - Add product to wishlist
  - **Auth:** Required
  - **Body:** `{ productId }`
  - **Response:** Redirects back

### Remove from Wishlist
- **POST** `/wishlist/remove/:productId` - Remove product from wishlist
  - **Auth:** Required
  - **Params:** `productId` - Product MongoDB ID
  - **Response:** Redirects to `/wishlist`

---

## Category Endpoints

### List Categories
- **GET** `/categories` - Display all categories
  - **Response:** Renders `categories.pug`

### Category Products
- **GET** `/category/:slug` - View products in category
  - **Params:** `slug` - Category slug (e.g., "seedlings")
  - **Response:** Renders `categoryProducts.pug`

### Add Category (Admin)
- **POST** `/category/add` - Create new category
  - **Auth:** Required (Agriculture Officer)
  - **Body:** `{ name, description, icon, image? }`
  - **Response:** Redirects to `/categories`

### Update Category (Admin)
- **POST** `/category/:id/update` - Update category
  - **Auth:** Required (Agriculture Officer)
  - **Body:** `{ name, description, icon, active }`
  - **Response:** Redirects to `/categories`

### Delete Category (Admin)
- **POST** `/category/:id/delete` - Delete category
  - **Auth:** Required (Agriculture Officer)
  - **Response:** Redirects to `/categories`

---

## Review Endpoints

### Submit Review
- **POST** `/product/:id/review` - Add product review
  - **Auth:** Required
  - **Body:** `{ rating, comment }`
  - **Response:** Redirects to product detail

### Get Reviews
- **GET** `/product/:id/reviews` - Get product reviews
  - **Response:** JSON array of reviews

### Delete Review
- **POST** `/review/:id/delete` - Delete review
  - **Auth:** Required (Review owner)
  - **Response:** Redirects back

---

## Dashboard Endpoints

### Urban Farmer Dashboard
- **GET** `/UB` - Urban farmer dashboard
  - **Auth:** Required (Urban Farmer)
  - **Response:** Renders `Urban.pug`

### Farmer One Dashboard
- **GET** `/FO` - Farmer One agent dashboard
  - **Auth:** Required (Farmer One)
  - **Response:** Renders `farmerone.pug`

### Agriculture Officer Dashboard
- **GET** `/OA` - Agriculture Officer dashboard
  - **Auth:** Required (Agriculture Officer)
  - **Response:** Renders `agricDashboard.pug`

---

## Agriculture Officer Endpoints

### View Farmers
- **GET** `/OA/farmers` - List all farmers
  - **Auth:** Required (Agriculture Officer)
  - **Response:** Renders `agricFarmers.pug`

### Verify Farmer
- **POST** `/OA/farmer/:id/verify` - Approve/verify farmer
  - **Auth:** Required (Agriculture Officer)
  - **Response:** Redirects back

### Reject Farmer
- **POST** `/OA/farmer/:id/reject` - Remove farmer verification
  - **Auth:** Required (Agriculture Officer)
  - **Response:** Redirects back

### View Buyers
- **GET** `/OA/buyers` - List all buyers
  - **Auth:** Required (Agriculture Officer)
  - **Response:** Renders `agricBuyers.pug`

### View Products
- **GET** `/OA/products` - List all products
  - **Auth:** Required (Agriculture Officer)
  - **Query Params:** `?filter=all|pending|approved|rejected`
  - **Response:** Renders `agricProducts.pug`

### Approve Product
- **POST** `/OA/approve-product` - Approve product
  - **Auth:** Required (Agriculture Officer)
  - **Body:** `{ productId }`
  - **Response:** Redirects to products list

### Reject Product
- **GET** `/OA/reject-product/:id` - Reject product
  - **Auth:** Required (Agriculture Officer)
  - **Query Params:** `?filter=all|pending|approved|rejected`
  - **Response:** Redirects to products list

### View All Products
- **GET** `/OA/all-products` - List all products (unfiltered)
  - **Auth:** Required (Agriculture Officer)
  - **Response:** Renders `agricProducts.pug`

### View Orders
- **GET** `/OA/orders` - View all orders
  - **Auth:** Required (Agriculture Officer)
  - **Response:** Renders orders page

### View Agents
- **GET** `/OA/agents` - List all Farmer One agents
  - **Auth:** Required (Agriculture Officer)
  - **Response:** Renders agents list

### Register Agent
- **POST** `/OA/register-agent` - Register new Farmer One agent
  - **Auth:** Required (Agriculture Officer)
  - **Body:** `{ Name1, email, phonenumber, password, ... }`
  - **Response:** Redirects to agents list

---

## Farmer One Endpoints

### Register Farmer
- **POST** `/FO` - Register new Urban Farmer
  - **Auth:** Required (Farmer One)
  - **Body:** `{ Name1, email, phonenumber, password, role: "Urban farmer", ... }`
  - **Response:** Redirects to dashboard

### Review Products
- **GET** `/FO/review-products` - Review products from registered farmers
  - **Auth:** Required (Farmer One)
  - **Response:** Renders `agricProducts.pug`

### My Farmers
- **GET** `/FO/my-farmers` - List registered farmers
  - **Auth:** Required (Farmer One)
  - **Response:** Renders farmers list

### View Products
- **GET** `/FO/products` - View products from registered farmers
  - **Auth:** Required (Farmer One)
  - **Query Params:** `?filter=all|pending|approved|rejected`
  - **Response:** Renders `agricProducts.pug`

---

## Profile Endpoints

### View Profile
- **GET** `/profile` - Display user profile
  - **Auth:** Required
  - **Response:** Renders `profile.pug`

### Update Profile
- **POST** `/profile/update` - Update user profile
  - **Auth:** Required
  - **Body:** `{ email, phonenumber, Gender1, bio, address, district, village, profileImage? }`
  - **Content-Type:** `multipart/form-data`
  - **Response:** Redirects to `/profile`

### Change Password
- **POST** `/profile/change-password` - Change user password
  - **Auth:** Required
  - **Body:** `{ currentPassword, newPassword, confirmPassword }`
  - **Response:** Redirects to `/profile`

---

## Testimonial Endpoints

### Submit Testimonial
- **POST** `/testimonial/submit` - Submit testimonial
  - **Auth:** Required
  - **Body:** `{ rating, comment, userName }`
  - **Response:** Redirects to home

### Get Testimonials (JSON API)
- **GET** `/testimonials` - Get all approved testimonials
  - **Response:** JSON array
  ```json
  [
    {
      "_id": "...",
      "rating": 5,
      "comment": "...",
      "userName": "...",
      "approved": true,
      "featured": true
    }
  ]
  ```

---

## Static Pages

- **GET** `/` - Home page
- **GET** `/about` - About page
- **GET** `/terms` - Terms and Conditions
- **GET** `/join-requirements` - Join requirements page

---

## Response Formats

### HTML Responses (Most Routes)
Most endpoints render Pug templates and return HTML pages. These are used for:
- User interfaces
- Forms
- Dashboards
- Product listings

### JSON Responses (Some Endpoints)
A few endpoints return JSON:
- `/testimonials` - Returns JSON array
- `/product/:id/reviews` - Returns JSON array
- `/delete-product/:id` - Returns JSON `{ message: "..." }`

---

## Authentication

Most endpoints require authentication using **Passport.js** with `connectEnsureLogin.ensureLoggedIn()` middleware.

**Session-based authentication:**
- Users login via `/login`
- Session stored in MongoDB
- Session persists across requests

---

## Error Handling

- **404 Errors:** Renders `404.pug`
- **500 Errors:** Renders `error.pug`
- **Flash Messages:** Success/error messages via `connect-flash`

---

## Data Models

### User/Registration
- Fields: `Name1`, `email`, `phonenumber`, `role`, `profileImage`, etc.

### Product/Upload
- Fields: `productName`, `category`, `price`, `quantity`, `image`, `status`, `owner`, etc.

### Order
- Fields: `orderNumber`, `buyer`, `items`, `totalPrice`, `paymentMethod`, `paymentStatus`, `orderStatus`, etc.

### Cart
- Fields: `user`, `items`, `totalPrice`, `totalItems`

### Category
- Fields: `name`, `description`, `icon`, `slug`, `active`

---

## Future API Enhancements

To convert this to a full REST API, you could:

1. **Add JSON response option** - Accept `Accept: application/json` header
2. **Create `/api/v1` routes** - Separate API routes from web routes
3. **Add API authentication** - JWT tokens for API access
4. **Standardize JSON responses** - Consistent format for all endpoints
5. **Add API versioning** - Support multiple API versions

---

## Example: Converting to JSON API

```javascript
// Current (HTML)
router.get("/product", async (req, res) => {
  const products = await Upload.find({ status: 'approved' });
  res.render("productList", { listProducts: products });
});

// JSON API Version
router.get("/api/v1/products", async (req, res) => {
  const products = await Upload.find({ status: 'approved' })
    .populate('category owner')
    .select('-__v');
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});
```

---

## Testing Endpoints

You can test endpoints using:
- **Browser** - For HTML endpoints
- **Postman/Insomnia** - For JSON endpoints
- **curl** - Command line tool
- **JavaScript fetch** - From frontend

Example:
```bash
# Get testimonials (JSON)
curl https://ufarm-oig6.onrender.com/testimonials

# Login (POST)
curl -X POST https://ufarm-oig6.onrender.com/login \
  -d "username=test&password=test123" \
  -c cookies.txt
```

---

**Last Updated:** 2024
**Version:** 1.0

