# AquaCycle - Code Documentation

## Project Structure

```
montevideo-app/
├── App.js                      # Main app entry point with navigation
├── components/                 # UI components
│   ├── classify.js            # Material classification screen
│   ├── dashboard.js           # Data display dashboard
│   ├── entry.js               # Data entry forms
│   ├── header.js              # App header component
│   ├── pastcollections.js     # Collection history view
│   ├── picker.js              # Client/location selection
│   ├── receptor.js            # Collection input screen
│   └── styles.js              # Shared component styles
├── services/                  # Business logic layer
│   ├── calls.js               # API abstraction layer
│   ├── localDatabase.js       # Local in-memory database
│   └── userServices.js        # User-related services
├── assets/                    # Images and icons
├── app.json                   # Expo configuration
└── package.json               # Dependencies

```

## Key Features Implementation

### 1. Authentication (App.js)
- Username/password login system
- 6 demo user accounts
- Secure credential handling (no display in UI)
- Context-based user state management

### 2. Collection Management (receptor.js)
- Create new waste pickups
- Edit existing pickups
- Add/remove collection bags
- Track total weight
- Client and location selection

### 3. Material Classification (classify.js)
- 18 material categories supported
- Weight input for each material type
- Status tracking (Pending → Completed)
- Real-time weight calculations

### 4. History & Reporting (pastcollections.js)
- View all collections
- Filter by status (Pending/Completed)
- Edit and classify from history
- Color-coded status display

## Database Structure

### Local Database (services/localDatabase.js)

**Collections:**
- **users** - 6 test users
- **clients** - 6 clients with 15 locations
- **pickups** - 10 sample pickups with bags and categories

**CRUD Operations:**
- `getUsers()` - Fetch all users
- `getClients()` - Fetch all clients
- `getPickups()` - Fetch all pickups
- `createPickup(data)` - Add new pickup
- `updatePickup(id, data)` - Update existing pickup
- `deletePickup(id)` - Remove pickup

## API Layer (services/calls.js)

All API calls route through `calls.js` which abstracts the data layer:

```javascript
import calls from './services/calls';

// Fetch data
calls.fetchClients(setClients);
calls.fetchPickups().then(data => ...);

// Create/Update
await calls.postPickups(payload);
await calls.patchPickup(id, payload);

// Delete
await calls.deletePickup(id);
```

## Material Categories

The app supports classification into 18 material types:

1. PET Cristal
2. PET Verde
3. PET Bandejas
4. Polietileno Botella
5. Nylon Transparente
6. Nylon Color
7. Papel Blanco
8. Revista/Diario
9. Cartón Corrugado
10. Aluminio
11. Chatarra
12. Electrónicos
13. Vidrio
14. Tetrabrik
15. Poliestireno Expandido
16. PP (5)
17. Poliestireno PS (6)
18. Descarte

## State Management

- **UserContext** - Global user authentication state
- **Local Component State** - Form inputs and UI state
- **Navigation State** - React Navigation stack

## Navigation Flow

```
Login Screen
    ↓
Home Screen
    ├── Collect → Receptor Component
    ├── Classify → Classify Component
    └── Past Collections → PastCollections Component
```

## Data Flow

```
User Action (UI Component)
    ↓
calls.js (API Layer)
    ↓
localDatabase.js (Data Layer)
    ↓
In-Memory Storage
```

## Security Features

✅ No production API access  
✅ Credentials not displayed in UI  
✅ Local database only  
✅ Safe for testing and demos  

## Running the App

```bash
# Install dependencies
npm install --legacy-peer-deps --ignore-scripts

# Start Expo server
npx expo start

# Run on device
# Scan QR code with Expo Go app
```

## Test Data Summary

- **6 Users** - demo, admin, test, maria, john, sarah
- **6 Clients** - Various recycling centers and facilities
- **15 Locations** - Collection points across Montevideo
- **10 Sample Pickups** - Mix of pending and completed collections

## Documentation Files

- `LOCAL_DATABASE_INFO.md` - Database setup and configuration
- `DATABASE_VERIFICATION.md` - Security verification report
- `CREDENTIALS_INTERNAL.md` - Test user credentials (not in Git)

---

**Last Updated:** ${new Date().toLocaleString()}  
**Version:** 1.0.0  
**Framework:** React Native (Expo)

