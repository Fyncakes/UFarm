# Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
database=mongodb://localhost:27017/UFarm
secret=your-session-secret-key-here

# Email Configuration (Optional - for notifications)
# If not configured, email notifications will be skipped
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Email Setup Instructions

### For Gmail:
1. Enable 2-factor authentication on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate an App Password (select "Mail" and "Other")
4. Use the generated 16-character password as `EMAIL_PASSWORD`

### For Other Services:
You can use other email services like SendGrid, Mailgun, or any SMTP service by changing `EMAIL_SERVICE` and providing the appropriate credentials.

## Application Configuration

```env
PORT=3000
NODE_ENV=development
```

## Note on Email Notifications

Email notifications are **optional**. The system will work without email configuration, but the following features will be disabled:
- Registration confirmation emails to Farmer One Agents
- Registration confirmation emails to Urban Farmers
- Order confirmation emails to customers
- Order notification emails to farmers

All these notifications will be logged to the console instead.

