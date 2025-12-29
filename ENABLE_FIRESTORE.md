# How to Enable Firebase Firestore API

## Quick Steps:

### Option 1: Direct Link (Easiest)
1. **Click this link:** https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=qr-attendance-47cc1
2. **Click the blue "ENABLE" button**
3. **Wait 2-3 minutes** for activation
4. **Restart your server**

### Option 2: Manual Steps

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Make sure you're logged in with the account that owns the Firebase project

2. **Select Your Project:**
   - Click the project dropdown at the top
   - Select: `qr-attendance-47cc1`

3. **Navigate to APIs:**
   - Click the hamburger menu (☰) in the top left
   - Go to: **APIs & Services** > **Library**

4. **Search for Firestore:**
   - In the search bar, type: `Cloud Firestore API`
   - Click on "Cloud Firestore API" from the results

5. **Enable the API:**
   - Click the blue **"ENABLE"** button
   - Wait for it to finish enabling (usually takes 10-30 seconds)

6. **Verify:**
   - You should see "API enabled" message
   - The button should change to "MANAGE"

## Create Firestore Database

After enabling the API, you need to create the database:

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/project/qr-attendance-47cc1/firestore

2. **Create Database:**
   - Click **"Create database"** button
   - Choose **"Start in test mode"** (for development)
   - Click **"Next"**
   - Select a **location** (choose the closest to you, e.g., `us-central`, `asia-south1`)
   - Click **"Enable"**

3. **Wait for database creation** (usually takes 1-2 minutes)

## Test the Setup

After completing the above steps:

1. **Restart your server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm start
   ```

2. **Test Firebase connection:**
   - Visit: http://localhost:3001/api/test-firebase
   - Should show: `{"status":"success","message":"Firebase connection working"}`

3. **Try registration again:**
   - Go to: http://localhost:3001/attendance
   - Enter a mobile number
   - Complete registration form
   - It should work now!

## Troubleshooting

**If you see "Permission denied" errors:**
- Make sure you're using the correct Google account
- Verify the project ID is `qr-attendance-47cc1`
- Wait a few more minutes after enabling the API

**If the API doesn't appear:**
- Make sure you're in the correct project
- Try refreshing the page
- Check if you have proper permissions on the project

**If database creation fails:**
- Make sure Firestore API is enabled first
- Try a different location
- Wait a bit longer and try again


