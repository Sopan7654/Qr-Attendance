# Pre-Deployment Checklist

## Before Deploying to Vercel

### ✅ Code Preparation
- [ ] All code is working locally
- [ ] Firebase Realtime Database is set up and working
- [ ] Tested registration flow
- [ ] Tested attendance marking
- [ ] Tested admin panel
- [ ] Tested Excel export

### ✅ Files to Prepare
- [ ] `vercel.json` created
- [ ] `.vercelignore` created
- [ ] `.gitignore` includes sensitive files
- [ ] `package.json` has all dependencies

### ✅ Environment Variables to Set in Vercel
- [ ] `ADMIN_PASSWORD` = `admin@123` (or your password)
- [ ] `SITE_URL` = (leave empty, update after deployment)
- [ ] `FIREBASE_SERVICE_ACCOUNT` = (paste JSON from firebase-service-account.json)
- [ ] `NODE_ENV` = `production`

### ✅ Firebase Service Account JSON
Copy the entire content of `firebase-service-account.json` and:
- Remove all line breaks
- Paste as single line in Vercel environment variable
- Or use this format (all on one line):
```json
{"type":"service_account","project_id":"qr-attendance-47cc1",...}
```

### ✅ GitHub Repository
- [ ] Code pushed to GitHub
- [ ] Repository is accessible
- [ ] No sensitive files committed (check .gitignore)

### ✅ After Deployment
- [ ] Update `SITE_URL` with your Vercel URL
- [ ] Test QR code generation
- [ ] Test all features
- [ ] Check Firebase connection
- [ ] Verify admin login works

## Quick Deploy Commands

```bash
# 1. Initialize git (if not done)
git init
git add .
git commit -m "Ready for deployment"

# 2. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/qr-attendance-system.git
git push -u origin main

# 3. Deploy to Vercel
# Option A: Via Dashboard (recommended)
# - Go to vercel.com, import GitHub repo

# Option B: Via CLI
npm install -g vercel
vercel login
vercel
```

