# Where Is My Data Saved?

## 📍 Current Storage Location

Your data is currently saved **in JavaScript memory** only.

### Technical Details:
- **File**: `services/localDatabase.js`
- **Variable**: `localData` object (lines 4-289)
- **Storage Type**: In-memory JavaScript object
- **Persistence**: ❌ **Temporary** - Only during the current session

### When You Submit Data:
1. Data is added to `localData.pickups` array (line 353)
2. Data is visible in "Past Collections" screen
3. Data stays in memory until you refresh/restart

### ⚠️ Important Limitations:

| Action | Data Status |
|--------|-------------|
| Submit pickup | ✅ Saved in memory |
| View in "Past Collections" | ✅ Visible |
| Refresh browser page | ❌ **Data LOST** |
| Restart dev server | ❌ **Data LOST** |
| Close browser tab | ❌ **Data LOST** |

## 🎯 Where to View Your Saved Data

After submitting a pickup form:
1. The app automatically navigates to **"Past Collections"** screen
2. You'll see your saved pickup in the list
3. You can click "Edit" or "Classify" to work with it

## 💾 Want Persistent Storage?

Currently, data is **NOT persisted** to disk. If you want data to survive page refreshes, I can add:

- **Option 1**: Browser localStorage (for web) - survives browser refresh
- **Option 2**: AsyncStorage (for mobile) - survives app restarts
- **Option 3**: Both - works everywhere

**Would you like me to add persistent storage so your data survives refreshes?**

---

**Current Status**: In-memory only (temporary)
**Data Location**: `services/localDatabase.js` → `localData` object

