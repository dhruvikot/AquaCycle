# Test Data Summary - Montevideo App

## 📊 Complete Test Database

### 👥 Test Users (6 Total)

All users have matching login credentials in the format: `username / password`

1. **Demo User** → `demo / demo123`
2. **Admin User** → `admin / admin123`
3. **Test User** → `test / test123`
4. **Maria Rodriguez** → `maria / maria123` ⭐ NEW
5. **John Smith** → `john / john123` ⭐ NEW
6. **Sarah Johnson** → `sarah / sarah123` ⭐ NEW

---

### 🏢 Test Clients (6 Total)

| ID | Client Name | Contact Person | Locations | Phone |
|----|-------------|----------------|-----------|-------|
| 1 | EcoRecycle Center | Carlos Mendez | 3 | 555-0101 |
| 2 | Green Solutions Inc | Ana Garcia | 3 | 555-0202 |
| 3 | Urban Waste Management | Roberto Silva | 2 | 555-0303 |
| 4 | Montevideo Recycling Co | Patricia Lopez | 3 ⭐ | 555-0404 |
| 5 | Plaza Independencia Offices | Luis Fernandez | 2 ⭐ | 555-0505 |
| 6 | Coastal Waste Services | Elena Martinez | 2 ⭐ | 555-0606 |

**Total Locations**: 15 collection points across all clients

---

### 📍 Client Locations (15 Total)

#### EcoRecycle Center (3 locations):
- Downtown Branch
- North Branch
- West Side Office ⭐

#### Green Solutions Inc (3 locations):
- Main Warehouse
- South Facility
- Industrial Park ⭐

#### Urban Waste Management (2 locations):
- Central Station
- East Hub ⭐

#### Montevideo Recycling Co (3 locations): ⭐ NEW CLIENT
- Pocitos Collection Point
- Ciudad Vieja Center
- Carrasco Facility

#### Plaza Independencia Offices (2 locations): ⭐ NEW CLIENT
- Floor 3 - Office Complex
- Floor 8 - Corporate

#### Coastal Waste Services (2 locations): ⭐ NEW CLIENT
- Punta Carretas Depot
- Malvin Processing Center

---

### 📦 Test Pickups (10 Total)

| ID | Client | Location | Weight (kg) | Status | Bags | Categories |
|----|--------|----------|-------------|--------|------|------------|
| 1 | EcoRecycle Center | Downtown Branch | 50 | P (Pending) | 2 | 0 |
| 2 | Green Solutions Inc | Main Warehouse | 75 | C (Completed) | 2 | 2 |
| 3 | Urban Waste Management | Central Station | 120 | C | 2 | 3 |
| 4 ⭐ | Montevideo Recycling Co | Pocitos | 85 | C | 3 | 4 |
| 5 ⭐ | Plaza Independencia | Floor 3 | 42 | P | 2 | 0 |
| 6 ⭐ | Coastal Waste Services | Punta Carretas | 195 | C | 3 | 5 |
| 7 ⭐ | EcoRecycle Center | North Branch | 68 | C | 2 | 3 |
| 8 ⭐ | Montevideo Recycling Co | Ciudad Vieja | 110 | P | 3 | 0 |
| 9 ⭐ | Green Solutions Inc | Industrial Park | 230 | C | 3 | 4 |
| 10 ⭐ | Urban Waste Management | East Hub | 92 | C | 3 | 4 |

**Summary:**
- **Total Pickups**: 10
- **Pending (P)**: 3 pickups
- **Completed (C)**: 7 pickups
- **Total Weight**: 1,067 kg
- **Average Weight**: ~107 kg per pickup

---

### 🎒 Test Bags (25 Total)

Bags are distributed across pickups with different colors:
- **Blue Bags**: 10 bags
- **Yellow Bags**: 8 bags
- **Green Bags**: 7 bags

Weight range: 20 kg - 90 kg per bag

---

### ♻️ Material Categories (25 Classifications)

Materials classified in completed pickups include:

**Most Common Materials:**
1. **PET Cristal** - 5 occurrences (170 kg total)
2. **Cartón Corrugado** - 4 occurrences (240 kg total)
3. **Papel Blanco** - 4 occurrences (120 kg total)
4. **Aluminio** - 3 occurrences (95 kg total)
5. **Vidrio** - 4 occurrences (115 kg total)

**Other Materials:**
- PET Verde
- Nylon Transparente
- Nylon Color
- Chatarra (Scrap metal)

---

## 🎯 Testing Scenarios

### Scenario 1: Create New Pickup
- Login as any user
- Go to "Collect"
- Select a client (6 to choose from)
- Select a location (15 total locations)
- Add bags with colors and weights
- Submit and verify in "Past Collections"

### Scenario 2: Edit Existing Pickup
- Go to "Past Collections" (10 pickups available)
- Click "Edit" on any pending pickup (IDs: 1, 5, 8)
- Modify bags or add notes
- Save changes

### Scenario 3: Classify Materials
- Go to "Past Collections"
- Click "Classify" on any pending pickup
- Add material weights across 18 material types
- Submit classification
- Status changes from 'P' to 'C'

### Scenario 4: View History
- Browse "Past Collections"
- See mix of completed and pending pickups
- View different clients and locations
- Check various weight ranges

### Scenario 5: Delete Pickup
- Edit a pickup
- Remove all bags to set weight to 0
- Submit to trigger automatic deletion

---

## 📈 Data Diversity

### Geographic Diversity:
- Montevideo neighborhoods represented (Pocitos, Ciudad Vieja, Carrasco, Punta Carretas, Malvin)
- Different zones (Downtown, North, South, East, West)
- Various facility types (offices, warehouses, depots, collection points)

### Client Types:
- Recycling centers
- Waste management companies
- Office buildings
- Industrial facilities
- Residential collection points

### Weight Ranges:
- **Small**: 42-50 kg (office waste)
- **Medium**: 68-120 kg (residential/commercial)
- **Large**: 195-230 kg (industrial)

### Time Distribution:
- Pickups span across 9 days
- Fresh data (today) to historical (9 days ago)
- Good mix for testing sorting and filtering

---

## 🔧 Technical Details

**Data Location**: `services/localDatabase.js`

**Auto-increment IDs:**
- Next Pickup ID: 11
- Next Bag ID: 26
- Next Category ID: 26

**Data Persistence:**
- In-memory during app session
- Resets on app restart
- CRUD operations fully functional

---

## ✅ What You Can Test

✅ **Login System** - 6 different user accounts  
✅ **Client Management** - 6 clients with 15 locations  
✅ **Create Pickups** - Add new collections  
✅ **Edit Pickups** - Modify existing data  
✅ **Delete Pickups** - Remove collections  
✅ **Classify Materials** - 18 material types available  
✅ **View History** - 10 sample pickups with variety  
✅ **Status Tracking** - Pending and Completed states  
✅ **Data Validation** - Weight calculations  
✅ **Multi-bag Support** - 1-3 bags per pickup  
✅ **Notes/Comments** - Add contextual information  

---

**Generated**: ${new Date().toLocaleString()}  
**Status**: ✅ Ready for Testing  
**Total Records**: 6 users, 6 clients, 15 locations, 10 pickups, 25 bags, 25 categories

