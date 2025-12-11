# Vercel Deployment Guide - QR Attendance System

Complete step-by-step guide to deploy your QR Attendance System on Vercel.

## Prerequisites

1. **GitHub Account** (free)
2. **Vercel Account** (free) - Sign up at https://vercel.com
3. **Firebase Realtime Database** (already set up)

## Step 1: Prepare Your Code

### 1.1 Create a GitHub Repository

1. Go to https://github.com and sign in
2. Click the **"+"** icon → **"New repository"**
3. Name it: `qr-attendance-system` (or any name you prefer)
4. Make it **Public** (or Private if you have GitHub Pro)
5. Click **"Create repository"**

### 1.2 Push Your Code to GitHub

Open terminal/PowerShell in your project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - QR Attendance System"

# Add your GitHub repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/qr-attendance-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Set Up Firebase Service Account for Vercel

### 2.1 Convert Firebase Service Account to Environment Variables

Since Vercel doesn't allow file uploads directly, we need to convert the service account to environment variables.

1. Open `firebase-service-account.json`
2. Copy the entire JSON content
3. We'll add this as an environment variable in Vercel

### 2.2 Update Server Code for Environment Variables

The server already reads from `firebase-service-account.json`. We need to make it also read from environment variables.

**Option A: Use Environment Variables (Recommended)**

Update `server.js` to read from environment variable if file doesn't exist:

```javascript
// Initialize Firebase Admin
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // For Vercel - read from environment variable
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // For local development - read from file
  serviceAccount = require('./firebase-service-account.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://qr-attendance-47cc1-default-rtdb.firebaseio.com'
});
```

## Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

### 3.2 Deploy via Vercel Dashboard (Easiest Method)

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Click "Add New..." → "Project"**
4. **Import your GitHub repository**:
   - Select `qr-attendance-system` (or your repo name)
   - Click **"Import"**

### 3.3 Configure Project Settings

1. **Framework Preset**: Select "Other" (or leave default)
2. **Root Directory**: `./` (default)
3. **Build Command**: Leave empty (not needed)
4. **Output Directory**: Leave empty
5. **Install Command**: `npm install`

### 3.4 Add Environment Variables

Click **"Environment Variables"** and add:

1. **`ADMIN_PASSWORD`**
   - Value: `admin@123` (or your preferred password)
   - Environment: Production, Preview, Development

2. **`SITE_URL`**
   - Value: Leave empty for now (we'll update after deployment)
   - Environment: Production, Preview, Development

3. **`FIREBASE_SERVICE_ACCOUNT`**
   - Value: Paste the entire JSON content from `firebase-service-account.json`
   - **Important**: Paste it as a single line (remove all line breaks)
   - Environment: Production, Preview, Development

4. **`NODE_ENV`**
   - Value: `production`
   - Environment: Production

### 3.5 Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (2-5 minutes)
3. You'll get a URL like: `https://qr-attendance-system.vercel.app`

## Step 4: Update Configuration

### 4.1 Update SITE_URL

After deployment:

1. Go to your Vercel project dashboard
2. Click **"Settings" → "Environment Variables"**
3. Update **`SITE_URL`** with your Vercel URL:
   - Value: `https://your-project-name.vercel.app`
4. **Redeploy** (go to Deployments → click "..." → Redeploy)

### 4.2 Update Firebase Realtime Database Rules (If Needed)

Your database should already be accessible. If you get permission errors:

1. Go to Firebase Console
2. Navigate to Realtime Database → Rules
3. Update rules to allow read/write (for development):
```json
{
  "rules": {
    "participants": {
      ".read": true,
      ".write": true
    },
    "attendance": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Step 5: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-project.vercel.app`
2. **Test QR Code**: Go to home page, QR should work
3. **Test Attendance**: Scan QR or go to `/attendance`
4. **Test Admin**: Go to `/admin`, login with your password
5. **Test Export**: Export Excel for a date

## Step 6: Custom Domain (Optional)

1. In Vercel dashboard, go to **"Settings" → "Domains"**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `SITE_URL` environment variable with your custom domain

## Troubleshooting

### Issue: Firebase Connection Error

**Solution**: 
- Check `FIREBASE_SERVICE_ACCOUNT` environment variable is set correctly
- Make sure JSON is on a single line (no line breaks)
- Verify Firebase Realtime Database is created and accessible

### Issue: QR Code Shows Wrong URL

**Solution**:
- Update `SITE_URL` environment variable with your Vercel URL
- Redeploy after updating environment variables

### Issue: 404 Errors

**Solution**:
- Check `vercel.json` is in root directory
- Verify all routes are properly configured
- Check Vercel deployment logs

### Issue: Environment Variables Not Working

**Solution**:
- Make sure you added variables in correct environment (Production)
- Redeploy after adding/updating variables
- Check variable names match exactly (case-sensitive)

## Important Notes

1. **Firebase Service Account**: Keep it secure, don't commit to GitHub
2. **Admin Password**: Use a strong password in production
3. **Database Rules**: For production, implement proper authentication
4. **Free Tier Limits**: Vercel free tier is generous but has limits
5. **Cold Starts**: First request after inactivity may be slower (serverless)

## Updating Your Deployment

Whenever you make changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically redeploy!

## Support

- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Check deployment logs in Vercel dashboard for errors

