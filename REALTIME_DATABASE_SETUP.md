# Firebase Realtime Database Setup (FREE - No Billing Required!)

Firebase Realtime Database is **completely free** and doesn't require billing to be enabled.

## Quick Setup Steps:

### Step 1: Create Realtime Database

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/project/qr-attendance-47cc1/database

2. **Create Realtime Database:**
   - Click **"Create Database"** button
   - Choose **"Start in test mode"** (for development)
   - Select a **location** (choose closest to you)
   - Click **"Enable"**

3. **Wait 1-2 minutes** for database creation

### Step 2: Update Security Rules (Optional but Recommended)

1. **Go to Rules tab** in Firebase Console
2. **Update rules** to allow read/write (for development):

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

3. Click **"Publish"**

### Step 3: Get Database URL

1. In Firebase Console, go to **Project Settings** > **Service Accounts**
2. Your database URL should be: `https://qr-attendance-47cc1-default-rtdb.firebaseio.com`
3. This is already configured in `server.js`

### Step 4: Test Connection

1. **Restart your server:**
   ```bash
   npm start
   ```

2. **Test Firebase connection:**
   - Visit: http://localhost:3001/api/test-firebase
   - Should show: `{"status":"success","message":"Firebase Realtime Database connection working"}`

## That's It! 🎉

No billing required! Realtime Database is free for:
- 1 GB storage
- 10 GB/month bandwidth
- 100 concurrent connections

This is perfect for small to medium events!

## Troubleshooting

**If you see "Permission denied":**
- Check that database is created
- Update security rules as shown above
- Make sure you're using the correct project

**If connection fails:**
- Verify database URL in `server.js` matches your project
- Check that Realtime Database (not Firestore) is created
- Wait a few minutes after creating the database


