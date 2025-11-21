# Quick Start Guide

## 🚀 Start Both Applications

### ⚠️ First Time Setup
**IMPORTANT:** Install dependencies first (only needed once):

```bash
# Install main app dependencies
npm install

# Install admin panel dependencies
cd Recycling_Scheduler_Admin
npm install
cd ..
```

### Starting the Apps

#### Windows (PowerShell)
```powershell
.\start-both.ps1
```

#### Mac/Linux
```bash
chmod +x start-both.sh
./start-both.sh
```

#### Manual Start

**Terminal 1 - Admin Panel:**
```bash
cd Recycling_Scheduler_Admin
npm run dev
```

**Terminal 2 - Main App:**
```bash
npm start
```

Then choose your platform:
- Press `w` for web
- Press `a` for Android
- Press `i` for iOS

## 🔑 Login Credentials

### Admin Access
- **Username:** admin
- **Password:** admin123
- **Features:** Full admin panel + all driver functions

### Driver Access
- **Username:** demo
- **Password:** demo123
- **Features:** Collect, Classify, Past Collections

Other driver accounts: maria, john, sarah (all with password: `{name}123`)

## 🎯 What's Different Now?

### For Admin Users:
1. Login with admin credentials
2. See "Open Admin Panel" button (green)
3. Click to access full admin features (Clients, Users, Materials, Statistics)
4. Also have access to driver functions below

### For Driver Users:
1. Login with driver credentials
2. See standard interface (Collect, Classify, Past Collections)
3. No admin features visible

## 📱 Accessing the App

After starting:
- **Main App:** Run `npm start` then choose platform (w/a/i)
  - Web: Press `w` (opens http://localhost:19006)
  - Android: Press `a` (requires emulator/device)
  - iOS: Press `i` (requires Mac with Xcode)
- **Admin Panel:** http://localhost:5173

## ⚙️ Configuration

To change the admin panel URL (for production or different port):

Edit `App.js`, line 27:
```javascript
const ADMIN_URL = 'http://localhost:5173'; // Change this
```

## 📚 More Information

See `INTEGRATION_GUIDE.md` for detailed documentation.

