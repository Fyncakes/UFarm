# 🚀 Deploy Ufarm to Render.com

## Step-by-Step Deployment Guide

### Prerequisites
- ✅ Code is ready (checked!)
- ✅ Git repository initialized (checked!)
- ✅ Package.json configured (checked!)

---

## 📝 Step 1: Create Render Account

1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up using:
   - **GitHub account** (recommended - easiest)
   - **GitLab account**
   - **Email** (requires email verification)

---

## 📂 Step 2: Push Code to GitHub (Required for Render)

Render deploys from Git repositories. You have two options:

### Option A: Push to Existing GitHub Repo (arondagmills/Project)
```bash
# You'll need GitHub authentication (Personal Access Token)
git push origin main
```

### Option B: Create New GitHub Repository
1. Go to **https://github.com/new**
2. Repository name: `Ufarm`
3. Description: `E-commerce platform for farmers`
4. Make it **Public** (for free Render deployment)
5. Click **"Create repository"**

Then push:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/Ufarm.git
git push -u origin main
```

---

## 🌐 Step 3: Create Web Service on Render

1. **Log into Render Dashboard:** https://dashboard.render.com
2. Click **"New +"** button (top-right)
3. Select **"Web Service"**

### Connect Repository
4. Click **"Connect GitHub"** or paste your repo URL
5. Find and select your **Ufarm** repository
6. Click **"Connect"**

### Configure Web Service

**Name:** `ufarm` (or any name you prefer)

**Region:** Choose closest to Uganda:
- **Europe (Frankfurt)** - Best for East Africa
- Or any available region

**Branch:** `main`

**Runtime:** `Node`

**Build Command:** (leave as default)
```
npm install
```

**Start Command:**
```
npm start
```

**Plan:** Select **"Free"** (perfect for testing!)

---

## 🔐 Step 4: Set Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

### Required Variables:

```
NODE_ENV=production
```

```
database=mongodb+srv://YOUR_MONGO_URI
```
(You'll need to create a MongoDB Atlas cluster - see Step 5)

```
secret=your-super-secret-session-key-change-this-in-production
```

### Optional Email Variables (if using email notifications):

```
EMAIL_SERVICE=gmail
```

```
EMAIL_USER=your-email@gmail.com
```

```
EMAIL_PASSWORD=your-app-password
```

**Click "Create Web Service"**

---

## 🗄️ Step 5: Create MongoDB Atlas Database (Free)

Your local MongoDB won't work on Render. Use MongoDB Atlas (free cloud database):

### Create Account
1. Go to **https://www.mongodb.com/cloud/atlas/register**
2. Sign up for free account

### Create Cluster
3. Click **"Build a Database"**
4. Choose **"M0 FREE"** tier
5. Select **AWS** → **Region: eu-central-1 (Frankfurt)** (closest to Uganda)
6. Cluster name: `Ufarm`
7. Click **"Create"**

### Create Database User
8. **Username:** `ufarmuser`
9. **Password:** Create a strong password (save it!)
10. Click **"Create User"**

### Allow Network Access
11. Click **"Network Access"** (left sidebar)
12. Click **"Add IP Address"**
13. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
14. Click **"Confirm"**

### Get Connection String
15. Click **"Database"** (left sidebar)
16. Click **"Connect"** on your cluster
17. Click **"Connect your application"**
18. Copy the connection string:
```
mongodb+srv://ufarmuser:<password>@ufarm.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
19. Replace `<password>` with your actual password
20. Add database name at the end:
```
mongodb+srv://ufarmuser:YOUR_PASSWORD@ufarm.xxxxx.mongodb.net/UFarm?retryWrites=true&w=majority
```

### Update Render Environment Variable
21. Go back to Render Dashboard
22. Click your **ufarm** service
23. Click **"Environment"** (left sidebar)
24. Update the `database` variable with your MongoDB Atlas connection string
25. Click **"Save Changes"**

---

## 🎉 Step 6: Deploy!

Render will automatically:
1. ✅ Clone your repository
2. ✅ Install dependencies (`npm install`)
3. ✅ Start your application (`npm start`)
4. ✅ Assign you a URL: `https://ufarm-xxxx.onrender.com`

**First deployment takes 5-10 minutes.**

Watch the **"Logs"** tab to see deployment progress.

---

## ✅ Step 7: Test Your Deployment

Once deployed, you'll see: **"Your service is live 🎉"**

1. **Click your service URL:** `https://ufarm-xxxx.onrender.com`
2. **Test the application:**
   - ✅ Homepage loads
   - ✅ Can view products
   - ✅ Can register/login
   - ✅ Can add products to cart

---

## 📊 What You Get on Render Free Tier

✅ **750 hours/month** of runtime (enough for 1 app running 24/7)
✅ **Automatic HTTPS** (SSL certificate)
✅ **Auto-deploy** on Git push
✅ **Free domain:** `yourapp.onrender.com`
✅ **Free SSL certificate**
⚠️ **Sleeps after 15 min inactivity** (wakes up in ~30 seconds on first request)

---

## 🔄 Future Updates

To update your live app:

1. Make changes locally
2. Commit: `git add . && git commit -m "Update message"`
3. Push: `git push origin main`
4. **Render auto-deploys!** (no manual action needed)

---

## 🐛 Troubleshooting

### "Application failed to respond"
- Check **Logs** tab for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### "Build failed"
- Check if `package.json` has correct start script
- Verify all dependencies are in `package.json`

### Database connection error
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check connection string has correct username/password
- Ensure database name is included in connection string

---

## 📞 Need Help?

- **Render Status:** https://status.render.com
- **Render Docs:** https://render.com/docs
- **MongoDB Atlas Docs:** https://www.mongodb.com/docs/atlas/

---

## 💰 Cost Breakdown

**Render Free Tier:**
- Web Service: **FREE** (750 hrs/month)
- Custom domain: **FREE**
- SSL: **FREE**

**MongoDB Atlas Free Tier:**
- Storage: **FREE** (512 MB)
- Bandwidth: **FREE**

**Total Monthly Cost: $0.00** 🎉

---

## 🚀 Ready to Deploy?

Follow steps 1-7 above, and your Ufarm platform will be live on the internet!

**Good luck! 🌾**

