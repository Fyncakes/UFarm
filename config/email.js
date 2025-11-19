const nodemailer = require("nodemailer");

// Create transporter with timeout settings to prevent hanging
const transporter = nodemailer.createTransport({
	service: process.env.EMAIL_SERVICE || "gmail",
	auth: {
		user: process.env.EMAIL_USER || "your-email@gmail.com",
		pass: process.env.EMAIL_PASSWORD || "your-app-password",
	},
	// Add connection timeout to prevent hanging
	connectionTimeout: 5000, // 5 seconds
	greetingTimeout: 5000,
	socketTimeout: 5000,
});

// Email templates
const emailTemplates = {
	// Urban Farmer Registration Confirmation
	urbanFarmerRegistration: (userName, agentName) => ({
		subject: "Welcome to Ufarm - Registration Confirmed!",
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<style>
					body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { background: linear-gradient(135deg, #7ed957 0%, #5cb85c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
					.content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
					.button { display: inline-block; background: #7ed957; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
					.footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>🌾 Welcome to Ufarm!</h1>
					</div>
					<div class="content">
						<h2>Hello ${userName}!</h2>
						<p>Congratulations! Your registration as an <strong>Urban Farmer</strong> has been successfully completed.</p>
						
						<p><strong>Registered by:</strong> ${agentName}</p>
						
						<h3>What's Next?</h3>
						<ul>
							<li>✅ Upload your products through your dashboard</li>
							<li>✅ Wait for approval from your Farmer One agent</li>
							<li>✅ Once approved, your products will be visible to buyers</li>
							<li>✅ Start earning from your farm produce!</li>
						</ul>
						
						<p>You can now log in and start uploading your products.</p>
						
						<a href="http://localhost:3000/login" class="button">Login to Your Dashboard</a>
						
						<p style="margin-top: 30px;">If you have any questions, please contact your Farmer One agent: <strong>${agentName}</strong></p>
					</div>
					<div class="footer">
						<p>&copy; 2024 Ufarm. All rights reserved.</p>
						<p>Connecting farmers, buyers, and sellers for sustainable agriculture</p>
					</div>
				</div>
			</body>
			</html>
		`,
	}),

	// Farmer One Agent Registration Confirmation
	farmerOneRegistration: (agentName, officerName) => ({
		subject: "Welcome to Ufarm - Farmer One Agent Confirmation",
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<style>
					body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { background: linear-gradient(135deg, #7ed957 0%, #5cb85c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
					.content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
					.button { display: inline-block; background: #7ed957; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
					.footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>🌾 Welcome to Ufarm!</h1>
					</div>
					<div class="content">
						<h2>Hello ${agentName}!</h2>
						<p>Congratulations! You have been successfully registered as a <strong>Farmer One Agent</strong>.</p>
						
						<p><strong>Registered by:</strong> Agriculture Officer ${officerName}</p>
						
						<h3>Your Responsibilities:</h3>
						<ul>
							<li>✅ Register and onboard Urban Farmers in your area</li>
							<li>✅ Review and approve product uploads from your farmers</li>
							<li>✅ Ensure quality and accuracy of farmer products</li>
							<li>✅ Provide support to farmers in your network</li>
							<li>✅ Monitor farmer performance and activity</li>
						</ul>
						
						<p>You can now log in and start managing your farmer network.</p>
						
						<a href="http://localhost:3000/login" class="button">Login to Your Dashboard</a>
						
						<p style="margin-top: 30px;">For any support, please contact Agriculture Officer: <strong>${officerName}</strong></p>
					</div>
					<div class="footer">
						<p>&copy; 2024 Ufarm. All rights reserved.</p>
						<p>Connecting farmers, buyers, and sellers for sustainable agriculture</p>
					</div>
				</div>
			</body>
			</html>
		`,
	}),

	// Agriculture Officer Notification - New Agent Registered
	officerAgentNotification: (agentName, officerName) => ({
		subject: "Ufarm - New Farmer One Agent Registered",
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<style>
					body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { background: linear-gradient(135deg, #7ed957 0%, #5cb85c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
					.content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
					.button { display: inline-block; background: #7ed957; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
					.footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>📊 New Agent Registration</h1>
					</div>
					<div class="content">
						<h2>Hello ${officerName}!</h2>
						<p>A new Farmer One Agent has been successfully registered in the system.</p>
						
						<p><strong>Agent Name:</strong> ${agentName}</p>
						<p><strong>Status:</strong> Active</p>
						
						<p>This agent can now begin registering Urban Farmers and managing their product submissions.</p>
						
						<a href="http://localhost:3000/OA" class="button">View Dashboard</a>
					</div>
					<div class="footer">
						<p>&copy; 2024 Ufarm. All rights reserved.</p>
					</div>
				</div>
			</body>
			</html>
		`,
	}),

	// Urban Farmer - Order Notification
	farmerOrderNotification: (farmerName, orderId, productName, quantity, totalAmount) => ({
		subject: "New Order Received - Ufarm",
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<style>
					body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { background: linear-gradient(135deg, #7ed957 0%, #5cb85c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
					.content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
					.order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
					.button { display: inline-block; background: #7ed957; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
					.footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>🎉 New Order Received!</h1>
					</div>
					<div class="content">
						<h2>Hello ${farmerName}!</h2>
						<p>Great news! You have received a new order.</p>
						
						<div class="order-details">
							<h3>Order Details:</h3>
							<p><strong>Order ID:</strong> #${orderId}</p>
							<p><strong>Product:</strong> ${productName}</p>
							<p><strong>Quantity:</strong> ${quantity}</p>
							<p><strong>Total Amount:</strong> UGX ${totalAmount.toLocaleString()}</p>
						</div>
						
						<p>Please prepare the order for delivery as soon as possible.</p>
						
						<a href="http://localhost:3000/farmer-orders" class="button">View Order Details</a>
					</div>
					<div class="footer">
						<p>&copy; 2024 Ufarm. All rights reserved.</p>
					</div>
				</div>
			</body>
			</html>
		`,
	}),

	// Customer - Order Confirmation
	customerOrderConfirmation: (customerName, orderId, items, totalAmount) => ({
		subject: "Order Confirmation - Ufarm",
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<style>
					body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { background: linear-gradient(135deg, #7ed957 0%, #5cb85c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
					.content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
					.order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
					.button { display: inline-block; background: #7ed957; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
					.footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
					.item { padding: 10px 0; border-bottom: 1px solid #eee; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>✅ Order Confirmed!</h1>
					</div>
					<div class="content">
						<h2>Thank you, ${customerName}!</h2>
						<p>Your order has been successfully placed and is being processed.</p>
						
						<div class="order-details">
							<h3>Order Summary:</h3>
							<p><strong>Order ID:</strong> #${orderId}</p>
							${items}
							<hr>
							<p style="font-size: 18px;"><strong>Total: UGX ${totalAmount.toLocaleString()}</strong></p>
						</div>
						
						<p>You will receive updates on your order status. The farmer will prepare your order for delivery.</p>
						
						<a href="http://localhost:3000/orders" class="button">Track Your Order</a>
					</div>
					<div class="footer">
						<p>&copy; 2024 Ufarm. All rights reserved.</p>
						<p>Thank you for supporting local farmers!</p>
					</div>
				</div>
			</body>
			</html>
		`,
	}),

	// Password Reset Email
	passwordReset: (userName, resetLink) => ({
		subject: "Password Reset Request - Ufarm",
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<style>
					body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { background: linear-gradient(135deg, #7ed957 0%, #5cb85c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
					.content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
					.button { display: inline-block; background: #7ed957; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
					.footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
					.warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>🔐 Password Reset Request</h1>
					</div>
					<div class="content">
						<h2>Hello ${userName}!</h2>
						<p>We received a request to reset your password for your Ufarm account.</p>
						
						<p>Click the button below to reset your password:</p>
						
						<div style="text-align: center;">
							<a href="${resetLink}" class="button">Reset Password</a>
						</div>
						
						<p>Or copy and paste this link into your browser:</p>
						<p style="word-break: break-all; color: #7ed957;">${resetLink}</p>
						
						<div class="warning">
							<strong>⚠️ Important:</strong>
							<ul style="margin: 10px 0; padding-left: 20px;">
								<li>This link will expire in 1 hour</li>
								<li>If you didn't request this, please ignore this email</li>
								<li>Your password will remain unchanged if you don't click the link</li>
							</ul>
						</div>
						
						<p style="margin-top: 30px;">If you have any concerns, please contact our support team.</p>
					</div>
					<div class="footer">
						<p>&copy; 2024 Ufarm. All rights reserved.</p>
						<p>Connecting farmers, buyers, and sellers for sustainable agriculture</p>
					</div>
				</div>
			</body>
			</html>
		`,
	}),

	// Password Reset Success Email
	passwordResetSuccess: (userName) => ({
		subject: "Password Reset Successful - Ufarm",
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<style>
					body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { background: linear-gradient(135deg, #7ed957 0%, #5cb85c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
					.content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
					.button { display: inline-block; background: #7ed957; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
					.footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
					.success { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>✅ Password Reset Successful</h1>
					</div>
					<div class="content">
						<h2>Hello ${userName}!</h2>
						
						<div class="success">
							<strong>✓ Your password has been successfully reset!</strong>
						</div>
						
						<p>Your account password has been changed. You can now log in with your new password.</p>
						
						<div style="text-align: center;">
							<a href="http://localhost:3000/login" class="button">Login Now</a>
						</div>
						
						<p style="margin-top: 30px;"><strong>Security Tip:</strong> If you didn't make this change, please contact our support team immediately.</p>
					</div>
					<div class="footer">
						<p>&copy; 2024 Ufarm. All rights reserved.</p>
					</div>
				</div>
			</body>
			</html>
		`,
	}),
};

// Send email function with timeout
async function sendEmail(to, template) {
	try {
		// Skip if email is not configured
		if (
			!process.env.EMAIL_USER ||
			process.env.EMAIL_USER === "your-email@gmail.com" ||
			!process.env.EMAIL_PASSWORD ||
			process.env.EMAIL_PASSWORD === "your-app-password"
		) {
			console.log("Email not configured. Skipping email to:", to);
			console.log("Subject:", template.subject);
			return { success: false, message: "Email not configured" };
		}

		const mailOptions = {
			from: `Ufarm <${process.env.EMAIL_USER}>`,
			to: to,
			subject: template.subject,
			html: template.html,
		};

		// Add timeout to prevent hanging
		const emailPromise = transporter.sendMail(mailOptions);
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => reject(new Error("Email sending timeout")), 10000); // 10 second timeout
		});

		const info = await Promise.race([emailPromise, timeoutPromise]);
		console.log("Email sent:", info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error("Email sending error:", error.message || error);
		return { success: false, error: error.message || "Email sending failed" };
	}
}

module.exports = {
	sendEmail,
	emailTemplates,
};

