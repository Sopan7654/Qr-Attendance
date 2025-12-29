# 🚀 Quick Deployment Guide - Follow These Steps

## Step 1: Push Code to GitHub (5 minutes)

### 1.1 Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `qr-attendance-system` (or any name)
3. Make it **Public** (or Private if you have GitHub Pro)
4. **Don't** initialize with README
5. Click **"Create repository"**

### 1.2 Push Your Code

Open PowerShell/Terminal in your project folder and run:

```bash
# Navigate to project
cd "C:\QR Attendance"

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "QR Attendance System - Ready for Vercel"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/qr-attendance-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If asked for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)
  - Get token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
  - Give it "repo" permissions

---

## Step 2: Deploy to Vercel (10 minutes)

### 2.1 Sign Up/Login to Vercel

1. Go to: https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### 2.2 Import Your Project

1. Click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find **"qr-attendance-system"** (or your repo name)
4. Click **"Import"**

### 2.3 Configure Project

**Leave everything as default:**
- Framework Preset: **Other** (or auto-detected)
- Root Directory: `./` (default)
- Build Command: (leave empty)
- Output Directory: (leave empty)
- Install Command: `npm install` (default)

**Click "Deploy"** (we'll add environment variables after)

---

## Step 3: Add Environment Variables (5 minutes)

### 3.1 Get Firebase Service Account JSON

Run this in your project folder:
```bash
node prepare-vercel-env.js
```

Copy the entire JSON output (it's one long line).

### 3.2 Add Variables in Vercel

1. **Go to your Vercel project** (click on project name)
2. **Click "Settings"** tab
3. **Click "Environment Variables"** (left sidebar)
4. **Add each variable:**

#### Variable 1: ADMIN_PASSWORD
- Key: `ADMIN_PASSWORD`
- Value: `admin@123`
- Environments: ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

#### Variable 2: SITE_URL
- Key: `SITE_URL`
- Value: (leave empty for now)
- Environments: ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

#### Variable 3: FIREBASE_SERVICE_ACCOUNT
- Key: `FIREBASE_SERVICE_ACCOUNT`
- Value: (paste the JSON from step 3.1)
- Environments: ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

#### Variable 4: NODE_ENV
- Key: `NODE_ENV`
- Value: `production`
- Environments: ✅ Production only (uncheck others)
- Click **"Save"**

### 3.3 Redeploy

1. Go to **"Deployments"** tab
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. ✅ Check **"Use existing build cache"**
5. Click **"Redeploy"**

---

## Step 4: Update SITE_URL (2 minutes)

1. **Wait for deployment to complete**
2. **Copy your Vercel URL** (e.g., `https://qr-attendance-system.vercel.app`)
3. **Go to Settings → Environment Variables**
4. **Find `SITE_URL`** → Click **"Edit"**
5. **Update value** to your Vercel URL: `https://your-project.vercel.app`
6. **Click "Save"**
7. **Redeploy again** (Deployments → ... → Redeploy)

---

## Step 5: Test Your Deployment

1. **Visit your Vercel URL**
2. **Test QR Code**: Should display on home page
3. **Test Attendance**: Go to `/attendance`, mark attendance
4. **Test Admin**: Go to `/admin`, login with `admin@123`
5. **Test Export**: Export Excel for a date

---

## ✅ Done!

Your QR Attendance System is now live! 🎉

---

## Troubleshooting

### Issue: GitHub push fails
- Use Personal Access Token instead of password
- Check repository URL is correct

### Issue: Vercel deployment fails
- Check deployment logs in Vercel dashboard
- Verify all environment variables are set
- Make sure `vercel.json` is in root directory

### Issue: Firebase connection error
- Verify `FIREBASE_SERVICE_ACCOUNT` is set correctly
- Check Firebase Realtime Database is created
- Redeploy after fixing variables

---

## Need Help?

If you encounter any errors:
1. Share the error message
2. Check Vercel deployment logs
3. Verify all environment variables are correct

