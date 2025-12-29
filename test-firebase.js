// Quick test script to check Firebase Realtime Database connection
require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://qr-attendance-47cc1-default-rtdb.firebaseio.com'
  });
  
  const db = admin.database();
  
  console.log('Testing Firebase Realtime Database connection...');
  
  const testRef = db.ref('test/connection-test');
  testRef.set({
    timestamp: admin.database.ServerValue.TIMESTAMP
  }).then(() => {
    console.log('✅ Firebase Realtime Database connection successful!');
    console.log('✅ No billing required - completely FREE!');
    return testRef.remove();
  }).then(() => {
    console.log('✅ Test data cleaned up.');
    process.exit(0);
  }).catch((err) => {
    console.error('❌ Firebase connection failed:');
    console.error('Error:', err.message);
    if (err.message.includes('PERMISSION_DENIED')) {
      console.error('\n📋 Please update Realtime Database rules:');
      console.error('   https://console.firebase.google.com/project/qr-attendance-47cc1/database/rules');
      console.error('   Set rules to allow read/write for development');
    }
    if (err.message.includes('not been used') || err.message.includes('does not exist')) {
      console.error('\n📋 Please create Realtime Database:');
      console.error('   https://console.firebase.google.com/project/qr-attendance-47cc1/database');
      console.error('   Click "Create Database" and choose "Start in test mode"');
    }
    process.exit(1);
  });
} catch (err) {
  console.error('❌ Failed to initialize Firebase:', err.message);
  process.exit(1);
}

