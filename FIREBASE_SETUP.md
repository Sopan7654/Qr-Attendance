# Firebase Setup Instructions

## Enable Firestore API

The Firebase Firestore API needs to be enabled in your Google Cloud Console.

### Steps:

1. **Visit the Google Cloud Console:**
   - Go to: https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=qr-attendance-47cc1
   - Or navigate manually:
     - Go to https://console.cloud.google.com/
     - Select project: `qr-attendance-47cc1`
     - Go to "APIs & Services" > "Library"
     - Search for "Cloud Firestore API"
     - Click "Enable"

2. **Wait a few minutes** for the API to be fully enabled

3. **Restart your server:**
   ```bash
   npm start
   ```

4. **Test the connection:**
   - Visit: http://localhost:3001/api/test-firebase
   - Should return: `{"status":"success","message":"Firebase connection working"}`

## Firestore Database Setup

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/project/qr-attendance-47cc1/firestore

2. **Create Database:**
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select a location (choose closest to you)
   - Click "Enable"

3. **Collections will be created automatically:**
   - `participants` - Stores registered participants
   - `attendance` - Stores attendance records

## Security Rules (Optional - for production)

For production, update Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /participants/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /attendance/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

For now, since we're using Admin SDK, the rules don't apply, but you should enable Firestore API as mentioned above.


