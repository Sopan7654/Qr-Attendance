<<<<<<< HEAD
# QR-Based Attendance System

A simple, user-friendly QR-based attendance system using Firebase Firestore.

## Features

- **QR Code Scanning**: Single QR code for all participants
- **Smart Registration**: Auto-detects if participant is registered
- **Auto-fill Details**: Registered users see their details automatically
- **Live Attendance**: Real-time attendance tracking in admin panel
- **Date-based Export**: Download Excel files for specific dates
- **Light Theme**: Clean, simple, and user-friendly interface

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Firebase Configuration**
   - Firebase service account file (`firebase-service-account.json`) is already configured
   - Firebase project: `qr-attendance-47cc1`

3. **Start Server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Usage

### For Participants

1. **Scan QR Code** → Opens attendance page
2. **Enter Mobile Number** → System checks if registered
3. **If Registered**: Details auto-fill → Click "Mark Attendance"
4. **If Not Registered**: Complete registration form → Automatically marks attendance after registration

### For Admin

1. **Access Admin Panel**: Go to `/admin`
2. **Login**: Enter admin password (default: `admin123`)
3. **Home Tab**: 
   - View QR code on the left
   - See live attendance list on the right
   - Attendance count updates automatically
4. **Export Tab**: 
   - Select a date
   - Download Excel file with attendance data

## API Endpoints

- `POST /api/check-registration` - Check if mobile number is registered
- `POST /api/register` - Register a new participant
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/live` - Get today's attendance (admin only)
- `GET /api/attendance/date/:date` - Get attendance for specific date (admin only)
- `GET /api/export/attendance/:date` - Export Excel for date (admin only)
- `GET /api/qr` - Get QR code image

## Firebase Collections

- **participants**: Stores participant registration data
- **attendance**: Stores attendance records with date and timestamp

## Configuration

Set environment variables in `.env`:
```
PORT=3000
ADMIN_PASSWORD=your_password_here
SITE_URL=http://localhost:3000
```

## Mobile Access

The server automatically detects your network IP and makes QR codes accessible from mobile devices on the same WiFi network. Check the console output for the network URL.


=======
# qr-attendance-system
>>>>>>> 80d2b26cac822b37dc605f1fb3e5d623b363a5ec
