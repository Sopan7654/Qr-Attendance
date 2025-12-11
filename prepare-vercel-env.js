// Helper script to prepare Firebase Service Account JSON for Vercel
// Run: node prepare-vercel-env.js

const fs = require('fs');
const path = require('path');

try {
  const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ firebase-service-account.json not found!');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  
  // Convert to single line JSON (for Vercel environment variable)
  const singleLine = JSON.stringify(serviceAccount);
  
  console.log('\n' + '='.repeat(70));
  console.log('📋 FIREBASE_SERVICE_ACCOUNT for Vercel Environment Variable');
  console.log('='.repeat(70) + '\n');
  console.log('Copy the following and paste it in Vercel as FIREBASE_SERVICE_ACCOUNT:\n');
  console.log(singleLine);
  console.log('\n' + '='.repeat(70));
  console.log('✅ Copy the JSON above and paste it in Vercel Dashboard');
  console.log('   Settings → Environment Variables → FIREBASE_SERVICE_ACCOUNT');
  console.log('='.repeat(70) + '\n');
  
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}

