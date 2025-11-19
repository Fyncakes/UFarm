# API Testing Guide

## Quick Start

### 1. Start the Server
```bash
npm start
# or
npm run dev
```

### 2. Test API Endpoints

#### Get API Information
```bash
curl http://localhost:3000/api/v1
```

#### Register a New User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "phonenumber": "0751082492",
    "password": "test123",
    "confirmPassword": "test123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

**Response will include a token:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "username": "testuser",
      "email": "test@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer"
  }
}
```

#### Get Products (Public - No Auth Required)
```bash
curl http://localhost:3000/api/v1/products
```

#### Get Single Product
```bash
curl http://localhost:3000/api/v1/products/PRODUCT_ID
```

#### Get Categories
```bash
curl http://localhost:3000/api/v1/categories
```

#### Get User Profile (Requires Auth)
```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Add to Cart (Requires Auth)
```bash
curl -X POST http://localhost:3000/api/v1/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

#### Get Cart (Requires Auth)
```bash
curl http://localhost:3000/api/v1/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Place Order (Requires Auth)
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "deliveryAddress": "123 Main St",
    "deliveryLocation": "Kampala",
    "paymentMethod": "cash_on_delivery",
    "notes": "Please deliver in the morning"
  }'
```

#### Get Orders (Requires Auth)
```bash
curl http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Using Postman

1. **Import Collection**: Create a new collection in Postman
2. **Set Base URL**: `http://localhost:3000/api/v1`
3. **Set Authorization**: 
   - Type: Bearer Token
   - Token: (Get from login response)
4. **Test Endpoints**: Use the curl commands above as reference

## Using JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'testuser',
    password: 'test123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.data.token;

// Get Products
const productsResponse = await fetch('http://localhost:3000/api/v1/products');
const productsData = await productsResponse.json();

// Add to Cart
const cartResponse = await fetch('http://localhost:3000/api/v1/cart/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productId: 'PRODUCT_ID',
    quantity: 1
  })
});
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... },
  "timestamp": "2024-01:00:00.000Z"
}
```

## Authentication

- **Public Endpoints**: No authentication required
  - GET /api/v1/products
  - GET /api/v1/products/:id
  - GET /api/v1/categories
  - POST /api/v1/auth/login
  - POST /api/v1/auth/register

- **Private Endpoints**: Require JWT token in Authorization header
  - GET /api/v1/auth/me
  - POST /api/v1/products
  - GET /api/v1/cart
  - POST /api/v1/cart/add
  - GET /api/v1/orders
  - POST /api/v1/orders

**Header Format:**
```
Authorization: Bearer <your-jwt-token>
```

## Environment Variables

Make sure to set in `.env`:
```
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

## Testing Checklist

- [ ] API info endpoint works
- [ ] User registration works
- [ ] User login returns token
- [ ] Token authentication works
- [ ] Get products (public) works
- [ ] Get single product works
- [ ] Get categories works
- [ ] Add to cart (with auth) works
- [ ] Get cart (with auth) works
- [ ] Place order (with auth) works
- [ ] Get orders (with auth) works
- [ ] Error handling works correctly

