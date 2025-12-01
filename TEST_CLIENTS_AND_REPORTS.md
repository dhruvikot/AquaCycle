# Testing Guide: Clients & Reports Integration

## ✅ What Was Changed

### 1. **Enhanced Client Database**
- **Expanded from 3 to 5 clients** representing diverse business types
- Added `client_type` field for better categorization
- Each client has realistic waste profiles based on their industry

### 2. **Improved Collection Data**
- Collections now generated for **all 5 clients**
- Realistic waste patterns based on client type:
  - Hotels: High organic waste
  - Restaurants: Very high organic waste
  - Supermarkets: High paper/cardboard and plastic
  - Offices: Very high paper, low organic
  - Factories: Balanced industrial waste
- **240 collections** generated across 2024-2025

### 3. **Synchronized Materials**
- Created `shared/materials.js` as single source of truth
- Both admin panel and driver app use the same material list
- Real-time sync - changes to one update both

---

## 🧪 Testing Checklist

### **Step 1: Test Clients Page**

1. **Start the admin panel** (should already be running)
   - URL: http://localhost:5173

2. **Navigate to "Clientes"**

3. **Verify you see 5 clients:**
   - ✓ Hotel Plaza (Hotelería)
   - ✓ Restaurante El Parador (Gastronomía)
   - ✓ Supermercado Central (Retail)
   - ✓ Oficinas Torre Libertador (Oficinas)
   - ✓ Fábrica Textil Del Sur (Industrial)

4. **Check each client has:**
   - Contact information
   - Pickup frequency
   - Location(s)

---

### **Step 2: Test Reports with Each Client**

Navigate to **"Estadísticas"** and test each client:

#### **Test A: Hotel Plaza (High Organic)**
1. Select: **Hotel Plaza**
2. Year: **2024**
3. Month: **November**
4. Click: **"Generar Informe"**

**Expected Results:**
- ✓ Bar chart shows 4 collections in November
- ✓ Pie chart shows ~40% organic waste (largest slice)
- ✓ Table shows actual kg values (not "SD")
- ✓ Total weight: ~200-250 kg
- ✓ Organico is the highest category

#### **Test B: Restaurante El Parador (Very High Organic)**
1. Select: **Restaurante El Parador**
2. Year: **2024**
3. Month: **November**
4. Click: **"Generar Informe"**

**Expected Results:**
- ✓ Pie chart shows ~60% organic waste (dominant)
- ✓ Very low paper/cardboard percentage
- ✓ 3 collections in November
- ✓ Total weight: ~150-200 kg

#### **Test C: Supermercado Central (High Paper/Plastic)**
1. Select: **Supermercado Central**
2. Year: **2024**
3. Month: **November**
4. Click: **"Generar Informe"**

**Expected Results:**
- ✓ Papel y Cartón is highest (~40%)
- ✓ Plásticos is second highest (~35%)
- ✓ 3 collections in November
- ✓ Total weight: ~180-230 kg

#### **Test D: Oficinas Torre Libertador (High Paper)**
1. Select: **Oficinas Torre Libertador**
2. Year: **2024**
3. Month: **November**
4. Click: **"Generar Informe"**

**Expected Results:**
- ✓ Papel y Cartón dominates (~50%)
- ✓ Very low organic waste (~8%)
- ✓ Only 2 collections in November (low frequency)
- ✓ Total weight: ~100-150 kg

#### **Test E: Fábrica Textil Del Sur (Industrial)**
1. Select: **Fábrica Textil Del Sur**
2. Year: **2024**
3. Month: **November**
4. Click: **"Generar Informe"**

**Expected Results:**
- ✓ Balanced waste profile
- ✓ High paper (~35%) and plastic (~30%)
- ✓ Higher descarte percentage (~25%)
- ✓ 4 collections in November
- ✓ Total weight: ~220-280 kg

---

### **Step 3: Test Full Year Reports**

1. Select any client
2. Year: **2024**
3. Month: **Leave blank** (for full year)
4. Click: **"Generar Informe"**

**Expected Results:**
- ✓ Table shows ALL 12 months
- ✓ Bar chart shows trend across the year
- ✓ Total row at bottom shows sum of all months
- ✓ Each month has data (no "SD" columns)

---

### **Step 4: Test Materials Page Sync**

#### In Admin Panel:
1. Navigate to **"Materiales Activos"**
2. Verify you see **18 materials** grouped by category
3. Note the green box: "✓ Sincronizado en tiempo real"

#### In Driver App:
1. Make sure main app is running (should be on background)
2. Press `w` for web (or use your platform)
3. Login: demo / demo123
4. Navigate to **Collect** → Select any pickup → **Classify**
5. Verify the **same 18 materials** appear

**Materials to verify match:**
- PET Cristal, PET Verde, PET Bandejas
- Polietileno Botella
- Nylon Transparente, Nylon Color
- Papel Blanco, Revista/Diario, Cartón Corrugado
- Aluminio, Chatarra
- Electrónicos
- Vidrio
- Tetrabrik
- Poliestireno Expandido, PP (5), Poliestireno PS (6)
- Descarte

---

### **Step 5: Test AI Summary (Optional)**

1. Generate a report for any client
2. The executive summary should automatically generate
3. Click the **edit icon** (pencil) next to "RESUMEN EJECUTIVO"
4. Modify the text
5. Click **save icon** (checkmark)
6. Verify the changes persist

---

## 📊 What Each Client Should Show

| Client | Collections/Month | Top Material | Total Monthly Weight |
|--------|-------------------|--------------|---------------------|
| Hotel Plaza | 4 | Orgánicos (40-45%) | ~200-250 kg |
| Restaurante El Parador | 3 | Orgánicos (60%) | ~150-200 kg |
| Supermercado Central | 3 | Papel/Cartón (40%) | ~180-230 kg |
| Oficinas Torre Libertador | 2 | Papel/Cartón (50%) | ~100-150 kg |
| Fábrica Textil Del Sur | 4 | Papel/Cartón (35%) | ~220-280 kg |

---

## 🐛 Common Issues

### Issue: "SD" appears in table
**Cause:** No collections for that month
**Solution:** Make sure year is 2024 or 2025, and month exists in dummy data

### Issue: Charts are empty
**Cause:** No client selected or no data loaded
**Solution:** 
1. Refresh the page
2. Select a client from dropdown
3. Click "Generar Informe"

### Issue: Materials don't match
**Cause:** Files weren't saved or app needs restart
**Solution:** 
1. Stop both apps (Ctrl+C in both terminals)
2. Restart using `.\start-both.ps1` or `npm start` + admin dev server

---

## 📁 Reference Documentation

For detailed information about data structure:
- See: `Recycling_Scheduler_Admin/DATA_STRUCTURE.md`

For quick start instructions:
- See: `QUICK_START.md`

For shared materials configuration:
- See: `shared/materials.js`

---

## ✅ Success Criteria

Your integration is working correctly if:

1. ✓ All 5 clients appear in Clientes page
2. ✓ Each client's reports show real numbers (not "SD")
3. ✓ Different clients show different waste profiles
4. ✓ Monthly filtering works correctly
5. ✓ Full year reports show all 12 months
6. ✓ Materials page matches classify page exactly
7. ✓ AI summary generates and is editable
8. ✓ Charts display correctly (bar + pie)
9. ✓ PDF export works
10. ✓ CSV export includes all data

---

**Ready to test? Both apps should still be running in the background!**

Admin Panel: http://localhost:5173
Main App: Run `npm start` and press `w` for web



