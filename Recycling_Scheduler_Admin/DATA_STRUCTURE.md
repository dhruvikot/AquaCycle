# Data Structure Documentation

## 📊 Overview

The admin panel uses a **dummy data system** that simulates a complete recycling management database. All data is stored in `src/data/dummyData.js` and accessed through `src/api/dummyCalls.js`.

---

## 👥 Clients (Customers)

### Client List
The system contains **5 diverse clients** representing different business types:

| ID | Client Name | Type | Pickup Frequency | Locations |
|---|---|---|---|---|
| `client-1` | Hotel Plaza | Hotelería | Mon-Fri | 2 locations |
| `client-2` | Restaurante El Parador | Gastronomía | Mon/Wed/Fri | 1 location |
| `client-3` | Supermercado Central | Retail | Tue/Thu/Sat | 2 locations |
| `client-4` | Oficinas Torre Libertador | Oficinas | Mon/Thu | 1 location |
| `client-5` | Fábrica Textil Del Sur | Industrial | Mon-Fri | 2 locations |

### Client Structure
```javascript
{
  id: 'client-1',
  client_name: 'Hotel Plaza',
  client_type: 'Hotelería',
  pickup_frequency: 'Lun Mar Mié Jue Vie',
  contact_name: 'Pedro Gonzalez',
  contact_email: 'pedro@hotelplaza.com',
  contact_phone: '+598-99-123-456',
  locations: [
    {
      id: 'loc-1-1',
      name: 'Edificio Principal',
      address: 'Av. 18 de Julio 1234, Montevideo',
      contact_name: 'Pedro Gonzalez',
      contact_phone: '+598-99-123-456'
    }
  ]
}
```

---

## 🚛 Collections

### Collection Generation
Collections are automatically generated for **2024 and 2025**, with realistic patterns based on client type:

| Client Type | Collections/Month | Waste Profile |
|---|---|---|
| Hotel | 4 | High organic (45%), moderate paper (25%) |
| Restaurant | 3 | Very high organic (60%), low paper (15%) |
| Supermarket | 3 | High paper (40%), high plastic (35%) |
| Office | 2 | Very high paper (50%), low organic (8%) |
| Factory | 4 | High paper (35%), high plastic (30%) |

### Collection Structure
```javascript
{
  id: 'coll-2024-11-0-2',
  clientId: 'client-1',
  timeStamp: Date('2024-11-12T12:00:00'),
  createdAt: Date('2024-11-12T12:00:00'),
  location: 'Edificio Principal',
  collections: [
    { materialId: 'papel_carton', weight: 32.5 },
    { materialId: 'plasticos', weight: 28.3 },
    { materialId: 'organico', weight: 55.7 },
    { materialId: 'otros', weight: 10.2 },
    { materialId: 'descarte', weight: 18.9 }
  ]
}
```

**Total Collections Generated:** ~240 collections across 5 clients for 2 years

---

## ♻️ Classifications

### Classification Structure
Each collection has a corresponding classification that breaks down materials into sub-categories:

```javascript
{
  id: 'class-coll-2024-11-0-2',
  clientId: 'client-1',
  collectionId: 'coll-2024-11-0-2',
  location: 'Edificio Principal',
  timeStamp: Date('2024-11-12T12:30:00'),
  createdAt: Date('2024-11-12T12:30:00'),
  classifications: [
    { materialId: 'papel_carton', subMaterialId: 'carton_corrugado', weight: 19.5 },
    { materialId: 'papel_carton', subMaterialId: 'papel_blanco', weight: 13.0 },
    { materialId: 'plasticos', subMaterialId: 'pet_natural', weight: 28.3 },
    { materialId: 'organico', subMaterialId: 'organico', weight: 55.7 },
    { materialId: 'otros', subMaterialId: 'latas_aluminio', weight: 5.1 },
    { materialId: 'otros', subMaterialId: 'electronicos', weight: 5.1 },
    { materialId: 'descarte', subMaterialId: 'descarte', weight: 18.9 }
  ]
}
```

---

## 📈 Reports Integration

### How Reports Work

1. **Client Selection**
   - Admin selects a client from the dropdown in StatisticReports page
   - System fetches all collections for that `clientId`

2. **Time Filtering**
   - Admin selects a year (2024 or 2025)
   - Optionally selects a specific month
   - System filters collections by `timeStamp`

3. **Data Aggregation**
   - Collections are grouped by month
   - Material weights are summed by category:
     - Plásticos
     - Papel y Cartón
     - Orgánicos
     - Otros
     - Descarte

4. **Visualization**
   - Monthly bar chart shows trends
   - Pie chart shows material distribution
   - Table displays detailed monthly breakdown
   - AI summary provides insights

### Example Report Flow

```
User Action: Select "Hotel Plaza" → Year "2024" → Month "November"
         ↓
System: Fetch all collections where clientId='client-1'
         ↓
System: Filter collections where year=2024 AND month=11
         ↓
System: Aggregate 4 collections from November 2024
         ↓
Result: Display ~150kg total waste with breakdown:
        - Orgánicos: 60kg (40%)
        - Papel/Cartón: 35kg (23%)
        - Plásticos: 30kg (20%)
        - Descarte: 18kg (12%)
        - Otros: 7kg (5%)
```

---

## 🔗 Data Relationships

```
CLIENTS (5)
  ↓
  ├── LOCATIONS (8 total)
  │
  └── COLLECTIONS (240 total for 2024-2025)
        ↓
        ├── Material Weights (5 categories per collection)
        │
        └── CLASSIFICATIONS (240 total)
              ↓
              └── Sub-Material Weights (detailed breakdown)
```

---

## 🛠️ How to Modify Data

### Add a New Client

1. Edit `Recycling_Scheduler_Admin/src/data/dummyData.js`
2. Add to `dummyClients` array:
```javascript
{
  id: 'client-6',
  client_name: 'New Business',
  client_type: 'Type',
  pickup_frequency: 'Lun Mié',
  contact_name: 'Contact Person',
  contact_email: 'email@business.com',
  contact_phone: '+598-99-XXX-XXX',
  locations: [...]
}
```

3. Add to `generateCollectionsForYear` function in the `clientConfigs` array:
```javascript
{
  id: 'client-6',
  locationNames: ['Main Location'],
  collectionsPerMonth: 3,
  wasteProfile: { papel_carton: 30, plasticos: 25, organico: 40, otros: 10, descarte: 15 }
}
```

4. Refresh the app - new client will appear with generated collections!

---

## ✅ Testing the Integration

### Verify Clients Page
1. Navigate to **Clientes** in admin panel
2. You should see all 5 clients with their contact info
3. Each client shows their locations and pickup frequency

### Verify Reports Page
1. Navigate to **Estadísticas** in admin panel
2. Select any client from dropdown
3. Select year 2024 or 2025
4. Select a specific month (or leave blank for full year)
5. Click "Generar Informe"
6. Verify:
   - ✓ Bar chart shows monthly data
   - ✓ Pie chart shows material distribution
   - ✓ Table displays kg values (not "SD")
   - ✓ Total matches sum of all materials
   - ✓ AI summary describes the data

### Expected Results
- **Hotel Plaza**: Most organic waste, daily pickups
- **Restaurante El Parador**: Highest organic percentage (60%)
- **Supermercado Central**: Most paper/cardboard waste
- **Oficinas Torre Libertador**: Highest paper percentage (50%)
- **Fábrica Textil Del Sur**: Balanced industrial waste profile

---

## 📝 Notes

- All data is **in-memory** and resets when the app restarts
- Data generation uses randomization for realistic variance
- Collections are spread evenly throughout each month
- Classifications are created 30 minutes after each collection
- Material weights vary by ±20-40% from baseline profiles

---

## 🔄 Real Database Migration

When ready to connect to a real database (Firebase/PostgreSQL):

1. Update `Recycling_Scheduler_Admin/src/main.jsx`
2. Replace `import { db } from "./api/dummyCalls.js"` with real Firebase config
3. Update API calls in `src/api/calls.js` to use real Firestore
4. The data structure is already compatible with the original Firebase schema

**File to modify:** `Recycling_Scheduler_Admin/src/main.jsx` line 4



