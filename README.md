# Ufarm - Agricultural E-Commerce Platform

Ufarm is a comprehensive e-commerce platform connecting farmers, buyers, and sellers in a sustainable agricultural marketplace. Built with Node.js, Express, MongoDB, and Pug templates.

## Features

### For Farmers
- Create and manage product listings
- Upload product images
- Track orders and sales
- Dashboard with statistics
- Product approval workflow

### For Buyers
- Browse fresh farm products
- Shopping cart functionality
- Secure checkout process
- Order tracking
- Product reviews and ratings
- Search and filter products

### For Agriculture Officers
- Verify and approve farmers
- Manage product listings
- Oversee orders
- Manage categories
- Platform statistics and analytics

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Template Engine**: Pug
- **Authentication**: Passport.js with Local Strategy
- **Session Management**: Express-session
- **File Upload**: Multer
- **Styling**: Bootstrap 5, Custom CSS
- **Icons**: Font Awesome 6

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ufarm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (use `.env.example` as template):
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your settings:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/UFarm
   SESSION_SECRET=your_secret_key_here
   ```

4. **Start MongoDB**
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

5. **Run the application**
   
   Development mode:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

6. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
Ufarm/
├── config/
│   ├── db.js              # Database configuration
│   └── passport.js        # Passport authentication config
├── models/
│   ├── User.js            # User/Registration model
│   ├── Product.js         # Product model
│   ├── Order.js           # Order model
│   ├── Cart.js            # Shopping cart model
│   ├── Category.js        # Category model
│   ├── Review.js          # Review model
│   └── Upload.js          # Upload model (legacy)
├── routers/
│   ├── authRoutes.js      # Authentication routes
│   ├── SignupRoutes.js    # Registration routes
│   ├── urbanRoutes.js     # Urban farmer routes
│   ├── farmeroneRouters.js # Farmer one routes
│   ├── agricRouter.js     # Agriculture officer routes
│   ├── produceRouter.js   # Product listing routes
│   ├── cartRouter.js      # Shopping cart routes
│   ├── orderRouter.js     # Order management routes
│   ├── reviewRouter.js    # Review routes
│   └── categoryRouter.js  # Category routes
├── views/
│   ├── includes/
│   │   ├── navbar.pug     # Navigation bar component
│   │   └── footer.pug     # Footer component
│   ├── home.pug           # Landing page
│   ├── Login.pug          # Login page
│   ├── Signup.pug         # Registration page
│   ├── productList.pug    # Product listing page
│   ├── cart.pug           # Shopping cart page
│   ├── checkout.pug       # Checkout page
│   ├── orders.pug         # Orders list page
│   ├── orderDetail.pug    # Order details page
│   ├── Urban.pug          # Urban farmer dashboard
│   ├── farmerone.pug      # Farmer one dashboard
│   ├── agricDashboard.pug # Agriculture officer dashboard
│   ├── categories.pug     # Categories page
│   ├── About_us.pug       # About page
│   ├── 404.pug            # 404 error page
│   └── error.pug          # Error page
├── public/
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side JavaScript
│   ├── image/             # Images
│   └── uploads/           # Uploaded files
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
└── .env                   # Environment variables (not in git)
```

## User Roles

### 1. Buyer/User
- Browse and purchase products
- Manage shopping cart
- Place and track orders
- Review products

### 2. Urban Farmer
- List products for sale
- Upload product images
- Manage inventory
- View sales

### 3. Farmer One
- Approve urban farmer products
- Register new farmers
- Monitor product quality

### 4. Agriculture Officer
- Overall platform management
- Verify farmers
- Manage categories
- View all statistics
- Moderate content

## API Routes

### Authentication
- `GET /login` - Login page
- `POST /login` - Process login
- `POST /logout` - Logout user
- `GET /Register` - Registration page
- `POST /Register` - Process registration

### Products
- `GET /product` - List all approved products
- `POST /uploads` - Upload new product (farmers)
- `POST /cart/add` - Add product to cart

### Cart & Orders
- `GET /cart` - View shopping cart
- `POST /cart/add` - Add item to cart
- `POST /cart/update/:itemId` - Update cart item
- `POST /cart/remove/:itemId` - Remove from cart
- `GET /checkout` - Checkout page
- `POST /order/place` - Place order
- `GET /orders` - View orders
- `GET /order/:id` - View order details

### Dashboards
- `GET /UB` - Urban farmer dashboard
- `GET /FO` - Farmer one dashboard
- `GET /OA` - Agriculture officer dashboard

## Default Accounts

After setting up, you can create test accounts with the following roles:

**Agriculture Officer:**
- Role: Agriculture Officer
- (Create via registration)

**Farmer:**
- Role: Urban farmer / Farmer one
- (Create via registration or through Farmer One dashboard)

**Buyer:**
- Role: user
- (Create via registration)

## Development

### Running in Development Mode

With automatic restart on file changes:
```bash
npm run dev
```

### Database Seeding

To populate the database with sample data (optional):
```bash
node seed.js
```

## Security Considerations

- Change `SESSION_SECRET` in production
- Use strong passwords
- Enable HTTPS in production
- Implement rate limiting
- Validate and sanitize all inputs
- Keep dependencies updated

## Deployment

### Production Checklist

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `SESSION_SECRET`
3. Configure MongoDB with authentication
4. Set up proper file upload limits
5. Enable HTTPS
6. Set up proper logging
7. Configure backups
8. Use a process manager (PM2)

### Using PM2

```bash
npm install -g pm2
pm2 start app.js --name ufarm
pm2 save
pm2 startup
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For support and questions:
- Email: support@ufarm.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

## License

MIT License - feel free to use this project for learning and development.

## Acknowledgments

- Bootstrap team for the UI framework
- Font Awesome for icons
- MongoDB team for the database
- Express.js community
- All contributors and testers

---

**Built with ❤️ for the agricultural community**

