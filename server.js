require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const admin = require('firebase-admin');
const ExcelJS = require('exceljs');
const QRCode = require('qrcode');
const net = require('net');
const os = require('os');

// Initialize Firebase Admin
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // For Vercel - read from environment variable
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // For local development - read from file
    serviceAccount = require('./firebase-service-account.json');
  }
} catch (err) {
  console.error('Firebase service account error:', err.message);
  // Fallback: try to read from file
  try {
    serviceAccount = require('./firebase-service-account.json');
  } catch (fileErr) {
    console.error('Could not load Firebase service account:', fileErr.message);
    throw new Error('Firebase service account not configured. Please set FIREBASE_SERVICE_ACCOUNT environment variable or provide firebase-service-account.json file.');
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://qr-attendance-47cc1-default-rtdb.firebaseio.com'
});

const db = admin.database();

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT) || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@123';

// Function to get local network IP address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  const wifiCandidates = [];
  const ethernetCandidates = [];
  const otherCandidates = [];
  
  for (const name of Object.keys(interfaces)) {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('loopback') || 
        nameLower.includes('virtual') ||
        nameLower.includes('vmware') ||
        nameLower.includes('virtualbox') ||
        nameLower.includes('vboxnet') ||
        nameLower.includes('vmnet') ||
        nameLower.includes('hyper-v') ||
        nameLower.includes('docker') ||
        nameLower.includes('wsl')) {
      continue;
    }
    
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        const ip = iface.address;
        
        if (ip.startsWith('192.168.56.') || ip.startsWith('192.168.99.')) {
          continue;
        }
        
        if (nameLower.includes('wifi') || nameLower.includes('wireless') || 
            nameLower.includes('wlan') || nameLower.includes('wi-fi')) {
          wifiCandidates.push(ip);
        } else if (nameLower.includes('ethernet') || nameLower.includes('lan') || 
                   nameLower.includes('local area connection')) {
          ethernetCandidates.push(ip);
        } else if (ip.startsWith('192.168.') || ip.startsWith('10.') || 
                   (ip.startsWith('172.') && parseInt(ip.split('.')[1]) >= 16 && 
                    parseInt(ip.split('.')[1]) <= 31)) {
          otherCandidates.push(ip);
        }
      }
    }
  }
  
  if (wifiCandidates.length > 0) return wifiCandidates[0];
  if (ethernetCandidates.length > 0) return ethernetCandidates[0];
  if (otherCandidates.length > 0) return otherCandidates[0];
  
  return 'localhost';
};

const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
};

const findFreePort = async (startPort) => {
  for (let port = startPort; port <= startPort + 100; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error('Could not find an available port');
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers
const requireAdmin = (req, res, next) => {
  const headerKey = req.headers['x-admin-key'];
  if (!headerKey || headerKey !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return next();
};

const normalizeString = (value) => (value || '').trim();

// Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Test Firebase connection
app.get('/api/test-firebase', async (_req, res) => {
  try {
    const testRef = db.ref('test/connection-test');
    await testRef.set({ timestamp: admin.database.ServerValue.TIMESTAMP });
    await testRef.remove();
    res.json({ status: 'success', message: 'Firebase Realtime Database connection working' });
  } catch (err) {
    console.error('Firebase test error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/network-info', (_req, res) => {
  const networkIP = getLocalIP();
  res.json({
    localIP: networkIP,
    port: actualPort || DEFAULT_PORT,
    networkUrl: `http://${networkIP}:${actualPort || DEFAULT_PORT}`,
    qrUrl: `http://${networkIP}:${actualPort || DEFAULT_PORT}/attendance`
  });
});

// Check if participant is registered
app.post('/api/check-registration', async (req, res) => {
  try {
    const mobile = normalizeString(req.body.mobile);
    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required.' });
    }

    const participantsRef = db.ref('participants');
    const snapshot = await participantsRef.once('value');
    const participants = snapshot.val() || {};

    // Find participant by mobile
    const participantEntry = Object.entries(participants).find(
      ([_, p]) => p.mobile === mobile
    );

    if (!participantEntry) {
      return res.json({ registered: false });
    }

    const [id, participant] = participantEntry;
    return res.json({ 
      registered: true, 
      participant: {
        id,
        ...participant
      }
    });
  } catch (err) {
    console.error('Check registration error:', err);
    res.status(500).json({ message: 'Error checking registration.' });
  }
});

// Register participant
app.post('/api/register', async (req, res) => {
  try {
    const fullName = normalizeString(req.body.fullName);
    const email = normalizeString(req.body.email);
    const mobile = normalizeString(req.body.mobile);
    const department = normalizeString(req.body.department);
    const employeeId = normalizeString(req.body.employeeId);

    if (!fullName || !mobile) {
      return res.status(400).json({ message: 'Full name and mobile are required.' });
    }

    // Check if mobile already exists
    const participantsRef = db.ref('participants');
    const snapshot = await participantsRef.once('value');
    const participants = snapshot.val() || {};
    
    const existing = Object.values(participants).find(p => p.mobile === mobile);
    if (existing) {
      return res.status(409).json({ message: 'Mobile number already registered.' });
    }

    const participantData = {
      fullName,
      email: email || '',
      mobile,
      department: department || '',
      employeeId: employeeId || '',
      createdAt: admin.database.ServerValue.TIMESTAMP
    };

    const newRef = participantsRef.push();
    await newRef.set(participantData);
    res.status(201).json({ id: newRef.key, message: 'Registration successful.' });
  } catch (err) {
    console.error('Registration error:', err);
    console.error('Error details:', err.message, err.stack);
    
    let errorMessage = 'Could not register participant.';
    if (err.message && err.message.includes('PERMISSION_DENIED')) {
      errorMessage = 'Database permission denied. Please check Firebase Realtime Database rules.';
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Mark attendance
app.post('/api/attendance', async (req, res) => {
  try {
    const mobile = normalizeString(req.body.mobile);
    const participantId = req.body.participantId;

    if (!mobile && !participantId) {
      return res.status(400).json({ message: 'Mobile number or participant ID is required.' });
    }

    let participant;
    if (participantId) {
      const snapshot = await db.ref(`participants/${participantId}`).once('value');
      if (!snapshot.exists()) {
        return res.status(404).json({ message: 'Participant not found.' });
      }
      participant = { id: participantId, ...snapshot.val() };
    } else {
      const participantsRef = db.ref('participants');
      const snapshot = await participantsRef.once('value');
      const participants = snapshot.val() || {};
      const participantEntry = Object.entries(participants).find(
        ([_, p]) => p.mobile === mobile
      );
      if (!participantEntry) {
        return res.status(404).json({ message: 'You must register first.' });
      }
      participant = { id: participantEntry[0], ...participantEntry[1] };
    }

    // Check if attendance already marked today (using local date, not UTC)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const attendanceRef = db.ref('attendance');
    const allAttendanceSnapshot = await attendanceRef.once('value');
    const allAttendance = allAttendanceSnapshot.val() || {};
    
    const todayAttendance = Object.values(allAttendance).find(att => {
      return att.participantId === participant.id && att.date === todayStr;
    });

    if (todayAttendance) {
      return res.json({
        status: 'already_marked',
        message: `Attendance already marked today.`
      });
    }

    // Mark attendance
    const attendanceData = {
      participantId: participant.id,
      participantName: participant.fullName,
      participantMobile: participant.mobile,
      participantEmail: participant.email || '',
      participantDepartment: participant.department || '',
      date: todayStr,
      timestamp: admin.database.ServerValue.TIMESTAMP
    };

    const pushRef = attendanceRef.push();
    await pushRef.set(attendanceData);
    res.json({
      status: 'marked',
      message: 'Attendance marked successfully.',
      timestamp: attendanceData.timestamp,
      participant: {
        name: participant.fullName,
        mobile: participant.mobile,
        email: participant.email,
        department: participant.department
      }
    });
  } catch (err) {
    console.error('Attendance error:', err);
    res.status(500).json({ message: 'Could not mark attendance.' });
  }
});

// Get live attendance (for admin home) - only today's entries
app.get('/api/attendance/live', requireAdmin, async (_req, res) => {
  try {
    // Get today's date in local timezone (YYYY-MM-DD format)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const attendanceRef = db.ref('attendance');
    const snapshot = await attendanceRef.once('value');
    const allAttendance = snapshot.val() || {};

    // Filter only today's attendance and sort by timestamp
    const attendance = Object.entries(allAttendance)
      .map(([id, data]) => {
        const ts = typeof data.timestamp === 'number' ? data.timestamp : Date.now();
        return {
          id,
          ...data,
          timestamp: ts
        };
      })
      .filter(att => att.date === todayStr) // Only today's entries
      .sort((a, b) => b.timestamp - a.timestamp); // Latest first

    res.json(attendance);
  } catch (err) {
    console.error('Fetch attendance error:', err);
    res.status(500).json({ message: 'Could not fetch attendance.' });
  }
});

// Get attendance by date (for Excel export)
app.get('/api/attendance/date/:date', requireAdmin, async (req, res) => {
  try {
    const { date } = req.params;
    const attendanceRef = db.ref('attendance');
    const snapshot = await attendanceRef.once('value');
    const allAttendance = snapshot.val() || {};

    const attendance = Object.entries(allAttendance)
      .map(([id, data]) => {
        const ts = typeof data.timestamp === 'number' ? data.timestamp : Date.now();
        return {
          id,
          ...data,
          timestamp: ts
        };
      })
      .filter(att => att.date === date)
      .sort((a, b) => b.timestamp - a.timestamp);

    res.json(attendance);
  } catch (err) {
    console.error('Fetch attendance error:', err);
    res.status(500).json({ message: 'Could not fetch attendance.' });
  }
});

// Export attendance to Excel
app.get('/api/export/attendance/:date', requireAdmin, async (req, res) => {
  try {
    const { date } = req.params;
    const attendanceRef = db.ref('attendance');
    const snapshot = await attendanceRef.once('value');
    const allAttendance = snapshot.val() || {};

    // Filter all attendance records for the specified date (exact match)
    const filteredAttendance = Object.entries(allAttendance)
      .map(([id, data]) => ({ id, ...data }))
      .filter(att => att.date === date) // Exact date match
      .sort((a, b) => {
        const tsA = typeof a.timestamp === 'number' ? a.timestamp : (a.timestamp ? Date.parse(a.timestamp) : 0);
        const tsB = typeof b.timestamp === 'number' ? b.timestamp : (b.timestamp ? Date.parse(b.timestamp) : 0);
        return tsB - tsA; // Latest first
      });

    // Map to Excel rows with all available details
    const rows = filteredAttendance.map(data => {
      const ts = typeof data.timestamp === 'number' ? data.timestamp : (data.timestamp ? Date.parse(data.timestamp) : Date.now());
      return {
        fullName: data.participantName || '',
        email: data.participantEmail || '',
        mobile: data.participantMobile || '',
        department: data.participantDepartment || '',
        timestamp: new Date(ts).toLocaleString(),
        date: data.date || date,
        participantId: data.participantId || ''
      };
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Attendance');

    // Add header row with styling
    sheet.columns = [
      { header: 'Name', key: 'fullName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Attendance Time', key: 'timestamp', width: 25 }
    ];

    // Style header row
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add all rows
    rows.forEach((row) => sheet.addRow(row));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="attendance-${date}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ message: 'Could not export attendance.' });
  }
});

// Dynamic SITE_URL
let SITE_URL = process.env.SITE_URL || '';
let actualPort = DEFAULT_PORT;
let localIP = 'localhost';

app.get('/api/qr', async (req, res) => {
  try {
    // Use SITE_URL from env if available (for Vercel), otherwise use local network IP
    let siteUrl;
    if (process.env.SITE_URL || process.env.VERCEL_URL) {
      siteUrl = process.env.SITE_URL || `https://${process.env.VERCEL_URL}`;
    } else {
      const networkIP = getLocalIP();
      const port = actualPort || DEFAULT_PORT;
      siteUrl = networkIP !== 'localhost' 
        ? `http://${networkIP}:${port}` 
        : `http://localhost:${port}`;
    }
    const attendanceUrl = `${siteUrl.replace(/\/$/, '')}/attendance`;
    
    const buffer = await QRCode.toBuffer(attendanceUrl, { type: 'png', width: 400 });
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', req.query.download ? 'attachment; filename=\"attendance-qr.png\"' : 'inline');
    res.send(buffer);
  } catch (err) {
    console.error('QR error:', err);
    res.status(500).json({ message: 'Could not generate QR code.' });
  }
});

// Static routes
app.get('/attendance', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'attendance.html'));
});

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export for Vercel serverless
module.exports = app;

// Start server for local development
if (require.main === module) {
  const startServer = async () => {
    let port = DEFAULT_PORT;
    
    if (!(await isPortAvailable(port))) {
      console.log(`⚠️  Port ${port} is already in use. Finding next available port...`);
      try {
        port = await findFreePort(port + 1);
        console.log(`✅ Found available port: ${port}`);
      } catch (err) {
        console.error('❌ Could not find an available port:', err.message);
        process.exit(1);
      }
    }

    localIP = getLocalIP();
    
    const server = app.listen(port, '0.0.0.0', () => {
      actualPort = server.address().port;
      const networkIP = getLocalIP();
      const localhostUrl = `http://localhost:${actualPort}`;
      const networkUrl = `http://${networkIP}:${actualPort}`;
      
      SITE_URL = process.env.SITE_URL || networkUrl;
      
      console.log('\n' + '='.repeat(60));
      console.log(`✅ QR Attendance server running!`);
      console.log('');
      console.log(`📍 Local access:    ${localhostUrl}`);
      console.log(`🌐 Network access:  ${networkUrl}`);
      console.log(`📱 Mobile/QR URL:   ${SITE_URL}`);
      console.log('='.repeat(60) + '\n');
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${port} is already in use.`);
        startServer();
      } else {
        console.error('Server error:', err);
        process.exit(1);
    }
    });
  };

  startServer();
}
