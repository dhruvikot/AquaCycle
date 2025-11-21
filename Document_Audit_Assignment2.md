# Documentation Audit – Project Status  
### CSEN 269 – Computing for Good  
### Project: Montevideo Waste Collection App  


---

## 1. Current Status of the Project  
After reviewing the full codebase, the app is already a functional MVP with the following completed features:

### ✅ User Login System
- Users select their name from a dropdown.
- Users are fetched from the backend.
- Context API manages user session.

### ✅ Waste Pickup Recording (Collect)
- Client → Location selection.
- Add bags with color, count, and weight.
- Multiple bag entries allowed.
- Auto-calculates total bags and total weight.
- Notes field included.
- Supports editing and deleting pickups.
- API routes:
  - POST /pickup
  - PATCH /pickup/{id}
  - DELETE /pickup/{id}

### ✅ Waste Classification (Classify)
- 18 material categories (plastics, paper, metals, glass, electronics, etc.)
- Enter weights for each category.
- Validates pickup selection.
- Updates status from Pending (P) to Completed (C).
- Sends category data to backend.

### ✅ Past Collections (History)
- Displays all pickups sorted by date.
- Color-coded statuses:
  - Green = Completed
  - Blue = Pending
- Action buttons for:
  - Editing pickups
  - Classifying pending pickups

### ✅ Technical Foundation
- React Native + Expo
- Axios-based API calls
- Clean component structure
- React Navigation for routing
- Error handling + alerts
- Fully connected to backend API

**Overall:** The existing app is stable, functional, and ready for enhancements.


## 2. New AI Feature We Are Adding  
From the Summary_CSEN_269 document, we selected **Feature #3: Voice-to-Text Note Entry** as our main LLM integration.

# 🎤 Voice-to-Text LLM Notes Feature (Selected Feature)

Workers struggle to type detailed notes during pickups because they work outdoors, wear gloves, and handle waste bags. This leads to missing or low-quality notes.

### ✔ What we are implementing:
1. A microphone button next to the Notes field.  
2. Audio recording using Expo’s `expo-av`.  
3. Whisper API for Spanish/English transcription.  
4. LLM (GPT/Claude/Gemini) to:
   - clean text  
   - fix grammar  
   - structure notes  
   - highlight warnings  

### ✔ Example

**Worker says:**  
"yellow bag mixed food waste contamination check client"


**⚠️ Contamination Alert:**  
Yellow bag contained food waste contamination.  
Recommendation: Notify client for sorting guidance.

This improves clarity and workflow without slowing the worker down.



### ✔ Identified the user need  
Typing notes is difficult; voice solves this.

### ✔ Finalized the feature  
Selected Voice-to-Text Note Entry as our LLM feature.

### ✔ Designed the technical flow
- Mic button → record → Whisper → LLM → formatted note  
- Backend route: `/transcribeNotes`  
- Frontend integration using Axios + FormData

### ✔ Verified feasibility  
The feature does not break the current architecture.

We are fully prepared to start development.



## 4. Next Steps (Implementation Plan)

- Add microphone icon in Collect screen.
- Set up `expo-av` for audio.
- Test audio capture.
- Create `/transcribeNotes` endpoint.
- Add Whisper transcription.
- Integrate LLM formatting.
- Upload audio file.
- Receive cleaned note.
- Auto-fill Notes field.
- Improve formatting prompt.
- Add fallback for empty audio.


## 5. Summary  
The app is fully functional and provides all core waste collection features. Our contribution focuses on the **Voice-to-Text AI Notes Feature**, which enhances safety, speed, and clarity during waste pickups.

This feature improves worker experience, boosts data quality, and supports NGO operations. It is practical, feasible, and aligns with Computing for Good objectives.


