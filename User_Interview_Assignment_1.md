# 📝 User Interview Summary  
### Computing for Good: Project Design – Fall 2024  
### Project: Food Waste Collection App (Frugal Innovation Lab)

---

## 1. Purpose of Interviews
Our goal was to understand how the current Food Waste Collection app works, the challenges users face, and where AI (LLMs) could improve donor, coordinator, and driver workflows. These insights will directly support our LLM-integration proposal for the course.

---

## 2. Participants
| Name | Role | Organization |
|------|------|--------------|
| **Arturo Torres Torres Landa** | Team Lead & Developer | Miller Center for Global Impact / Frugal Lab |
| **Allan Báez** | Lab Manager | Frugal Innovation Lab |
| **Our Team** | Interviewers | SCU – Computing for Good |

---

## 3. Interview Details
- **Date:** Thursday, Nov 13, 2024  
- **Time:** 1:00 – 1:30 PM  
- **Mode:** Google Meet  
- **Context:** The Food Waste Collection app is already deployed and used by NGOs. Our task is to identify opportunities for AI features without breaking the existing system.

---

## 4. Interview Questions & Responses

### **Q1. Can you explain what the Food Waste Collection App currently does?**  
**A (Arturo):**  
The app enables NGOs to collect surplus food from donors and deliver it to communities. Donors register, submit pickup requests, coordinators assign drivers, and drivers complete routes. It is actively used and maintained by students.

---

### **Q2. What are the biggest challenges users face today?**  
**A (Arturo):**  
- Donors sometimes enter incomplete or inaccurate pickup information.  
- Coordinators struggle with managing many simultaneous pickups.  
- Drivers want clearer routing and priority guidance.  
- Admin reporting is fully manual and time-consuming.

---

### **Q3. Where do you see AI/LLMs adding value?**  
**A (Arturo):**  
- A guided form-filling experience for donors (AI assistant).  
- Automatic routing suggestions for drivers.  
- Priority tagging for urgent pickups.  
- Auto-generated weekly reports for NGOs and admins.

---

### **Q4. What constraints should we be aware of?**  
**A (Arturo):**  
Keep improvements lightweight. Avoid breaking the existing live version. AI features should feel like “add-ons,” not system-wide rewrites.

---

### **Q5. What pain points do NGO staff repeatedly mention?**  
**A (Arturo):**  
- Data entry errors that slow the process.  
- Difficulty in identifying urgent or perishable food pickups.  
- Long manual communication threads between donors → coordinators → drivers.

---

## 5. Additional Insight from the Provided Project Summary (CSEN_269 Summary)
Based on the `Summary_CSEN_269.pdf`:

- Donor onboarding is a bottleneck — many donors need help understanding the process.  
- Coordinators rely on WhatsApp or calls when the app lacks clarity.  
- Pickup timing windows often cause confusion.  
- Reporting requirements for NGOs are increasing as they scale.  
- The entire workflow would benefit from a “guided assistant.”

These insights align strongly with the interview responses.

---

## 6. Key Findings (Condensed)
- Users want **less manual work** and **more automation**.  
- Donors need **guided help** to reduce form errors.  
- Coordinators need **smart triaging** of requests.  
- Drivers need **better routing clarity**.  
- Admins want **auto-generated summaries**.

---

## 7. Opportunities for LLM Integration

### **1. Smart Pickup Form Assistant**
A conversational LLM that:  
- guides donors in simple English,  
- auto-corrects mistakes,  
- validates missing fields (e.g., pickup time, food type, quantity).

---

### **2. Intelligent Route Helper**
AI + Maps API can:  
- suggest best pickup order,  
- highlight time-sensitive stops,  
- reduce coordinator workload.

---

### **3. Automated Weekly/Monthly NGO Insights**
An LLM can generate:  
- collection summaries,  
- donor activity patterns,  
- food quantity breakdowns,  
- hotspot locations.

---

### **4. Smart Notifications**
AI tags pickups as:  
- urgent / normal,  
- large quantity,  
- recurring donor,  
- high-priority areas.

This helps coordinators plan faster.

---

## 8. Next Steps (For Assignment 2)
- Define one primary AI feature we will implement.  
- Create a lightweight architecture diagram.  
- Identify where the LLM API will connect.  
- Validate feasibility with Arturo and Allan.  
- Start building a prototype.

---

## 9. Appendix: Email Communication Timeline  
(For transparency and assignment requirements)

### **Outreach → Scheduling → Confirmation**
- Oct 27: Email to Allan to schedule Loom interviews  
- Oct 31: Allan connected team with Arturo  
- Nov 3–10: Email coordination for meeting  
- Nov 13: Meeting confirmed → Interview conducted

Emails included:  
- Request for repo  
- Scheduling meeting  
- Confirming time  
- Sending Meet link  

(You can add screenshots if needed.)

---

**Prepared by:**  
Yash Pokharna  
Dhruvi Kothari  
Dhruv Shah  
MSCS Candidates, Santa Clara University

