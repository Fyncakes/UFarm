# 📸 Cloudinary Setup Guide for UFarm

## Why Cloudinary?

Render's free tier has an **ephemeral filesystem** - any files uploaded (images) are deleted when your app restarts. Cloudinary provides:
- ✅ **FREE** cloud storage (25 GB)
- ✅ **FREE** bandwidth (25 GB/month)
- ✅ **FREE** transformations (25,000/month)
- ✅ Images persist forever
- ✅ Automatic image optimization
- ✅ CDN delivery (fast worldwide)

---

## 🚀 Step-by-Step Setup

### Step 1: Create Cloudinary Account (2 minutes)

1. **Go to:** https://cloudinary.com/users/register/free
2. **Sign up:**
   - Use Google/GitHub (fastest)
   - Or email (free forever)
3. **Verify email** (if using email signup)
4. **Login to Dashboard:** https://cloudinary.com/console

---

### Step 2: Get Your Credentials

After logging in, you'll see your **Dashboard**.

Look for the **"Product Environment Credentials"** section (usually at the top):

You'll see something like:
```
Cloud name: your-cloud-name
API Key: 123456789012345
API Secret: abcdefghijk1234567890
```

📝 **Copy these three values!** You'll need them in Step 3.

**Example:**
```
Cloud name: ufarm-cloud
API Key: 987654321098765
API Secret: xyz123abc456def789ghi
```

---

### Step 3: Add Environment Variables to Render

Now let's add these to your Render deployment:

1. **Go to:** https://dashboard.render.com
2. **Click** your `ufarm` service
3. **Click** "Environment" (left sidebar)
4. **Click** "Add Environment Variable"

**Add these THREE new variables:**

#### Variable 1:
```
Key: CLOUDINARY_CLOUD_NAME
Value: your-cloud-name
```
(Replace with YOUR cloud name from Step 2)

#### Variable 2:
```
Key: CLOUDINARY_API_KEY
Value: 123456789012345
```
(Replace with YOUR API key from Step 2)

#### Variable 3:
```
Key: CLOUDINARY_API_SECRET
Value: abcdefghijk1234567890
```
(Replace with YOUR API secret from Step 2)

5. **Click "Save Changes"** (bottom of page)

---

### Step 4: Push Updated Code to GitHub

The code has already been updated to use Cloudinary. Now push it:

```bash
git add .
git commit -m "Add Cloudinary for image uploads"
git push origin main
```

Render will automatically redeploy! 🚀

---

### Step 5: Test Image Uploads

Once deployed (watch the Logs tab):

1. **Go to your live app:** https://ufarm-oig6.onrender.com
2. **Login** as a farmer
3. **Upload a product** with an image
4. **Check Cloudinary Dashboard:**
   - Go to: https://cloudinary.com/console/media_library
   - You should see your uploaded image in `ufarm/products` folder!

---

## ✅ What's Changed?

### Before (Local Storage - BROKEN on Render):
```
public/image/product.jpg  ❌ Deleted on restart
public/uploads/profile.jpg  ❌ Deleted on restart
```

### After (Cloudinary - WORKS on Render):
```
https://res.cloudinary.com/ufarm-cloud/image/upload/v123/ufarm/products/abc123.jpg  ✅ Permanent
https://res.cloudinary.com/ufarm-cloud/image/upload/v123/ufarm/profiles/xyz456.jpg  ✅ Permanent
```

---

## 📊 Cloudinary Free Tier Limits

| Feature | Free Tier |
|---------|-----------|
| Storage | 25 GB |
| Bandwidth | 25 GB/month |
| Transformations | 25,000/month |
| Images | Unlimited |
| CDN | ✅ Yes |
| Cost | **$0/month** |

**Perfect for UFarm!** 🎉

---

## 🔧 Code Changes Summary

### Files Updated:
1. ✅ `config/cloudinary.js` - NEW file for Cloudinary configuration
2. ✅ `routers/urbanRoutes.js` - Product images now use Cloudinary
3. ✅ `routers/profileRouter.js` - Profile images now use Cloudinary
4. ✅ `package.json` - Added cloudinary packages

### How It Works:
- When user uploads image → Goes to Cloudinary
- Cloudinary returns URL → Stored in MongoDB
- When displaying images → Uses Cloudinary URL (CDN-delivered, fast!)

---

## 🐛 Troubleshooting

### Error: "Invalid cloud_name"
**Fix:** Check `CLOUDINARY_CLOUD_NAME` environment variable in Render. Must match your Cloudinary dashboard.

### Error: "Invalid API key"
**Fix:** Check `CLOUDINARY_API_KEY` environment variable. Copy exactly from Cloudinary dashboard.

### Error: "Invalid API secret"
**Fix:** Check `CLOUDINARY_API_SECRET` environment variable. No spaces, copy exactly.

### Images not uploading
**Causes:**
1. Environment variables not set in Render
2. Cloudinary account not verified
3. File size too large (5MB limit)

**Fix:**
1. Verify all 3 environment variables in Render
2. Check Cloudinary account is active
3. Try smaller image

---

## 📸 Image Optimization

Cloudinary automatically:
- ✅ Converts to WebP (modern format, smaller size)
- ✅ Compresses images (faster loading)
- ✅ Resizes to optimal dimensions
- ✅ Delivers via CDN (faster worldwide)

**Configuration in `config/cloudinary.js`:**
```javascript
// Product images: Max 800x800px
transformation: [{ width: 800, height: 800, crop: 'limit' }]

// Profile images: Max 500x500px
transformation: [{ width: 500, height: 500, crop: 'limit' }]
```

---

## 🎯 Next Steps After Setup

1. ✅ Test product upload
2. ✅ Test profile image upload
3. ✅ Check images appear on site
4. ✅ Verify images in Cloudinary dashboard

---

## 📞 Need Help?

**Cloudinary:**
- Dashboard: https://cloudinary.com/console
- Docs: https://cloudinary.com/documentation
- Support: https://support.cloudinary.com

**Common Questions:**

**Q: Will old images (before Cloudinary) still work?**
A: No, they were deleted when Render restarted. But new uploads will work permanently!

**Q: Can I use my own domain for images?**
A: Yes, Cloudinary supports custom domains (paid plans).

**Q: What happens if I exceed free tier?**
A: Cloudinary will email you. You can upgrade or optimize usage.

---

## ✅ Success Checklist

Before marking as complete:

- [ ] Cloudinary account created
- [ ] Got cloud_name, api_key, api_secret
- [ ] Added 3 environment variables to Render
- [ ] Pushed code to GitHub
- [ ] Render redeployed successfully
- [ ] Can upload product images
- [ ] Images appear on website
- [ ] Images visible in Cloudinary dashboard

---

**Your images are now in the cloud! 🎉☁️**

