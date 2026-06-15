# UMES (منظومة بلاغات الصيانة الموحدة) - Identity & Access Management (IAM) Blueprint

This document defines the real-world data tokens used within the Egyptian Ministry of Education (MOE) ecosystem to verify personnel validity, alongside the strict Access Control Matrix for school infrastructure logistics.

---

## 1. Core Verification Tokens & Data Sources

To verify if an individual is a legitimate employee before allowing account creation, the system maps their 14-digit National ID against pre-seeded administrative databases:

| Role | Primary Verification Token | Data Format / Source | System Validation Mechanism |
| :--- | :--- | :--- | :--- |
| **All Personnel** | **National ID (الرقم القومي)** | 14-digit numeric string (Civil Status Dept.) | Must exist in the school's active payroll registry (*صحيفة الأحوال الإلكترونية*). |
| **Teachers** | **Teacher Code (كود المعلم)** | 6 to 7 digit static identifier | Cross-referenced with the Academy for Teachers database (*الأكاديمية المهنية للمعلمين*). |
| **IT Admins / Principals** | **Unified Ministry Email (البريد الموحد)** | `name@governorate.moe.edu.eg` (Office 365 Enterprise) | Verified via Active Directory/T4Edu tenant clearance tokens. |
| **School Specific** | **Ministry School Code (كود المدرسة)** | 7 to 8 digit unique identifier | Automatically associates the user to a physical building asset queue. |

---

## 2. System Access Control Matrix (Role Permissions)

To protect infrastructure data and ensure accountability, users are locked into strict authorization scopes based on their checked roles:

### 🏢 1. School Principal (مدير المدرسة)
* **Identity Target:** The absolute authority figure over the local institution.
* **System Permissions:**
    * **Read Access:** Full view of every infrastructure issue, financial cost estimation, and technician response times inside the building.
    * **Write Access:** Final Approval/Sign-off (*اعتماد وموافقة*) on critical maintenance tickets (e.g., structural cracks, major power failures) that require requesting funds from the Educational Directorate (*الإدارة التعليمية*).
    * **Denial Limits:** Cannot write code, edit log files, or manually resolve technical hardware tickets.

### 🛠️ 2. IT / Technology Administrator (مسؤول التطوير التكنولوجي)
* **Identity Target:** The local hardware, network, and infrastructure authority.
* **System Permissions:**
    * **Read Access:** Complete view of technology logs, computer lab failure states, smartboard asset trackers, and network topology tickets.
    * **Write Access:** Can directly create, assign, and update statuses on all technology asset queues (`Open` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`). 
    * **Denial Limits:** Cannot approve structural budgetary requests; restricted from closing building/civil infrastructure tickets (e.g., plumbing, masonry) without principal sign-off.

### 📝 3. Classroom Teacher / Educator (معلم)
* **Identity Target:** The frontline staff observing classroom asset degradation.
* **System Permissions:**
    * **Read Access:** Restricted to viewing only the status of tickets they personally generated (e.g., "Smartboard in Room 204 won't boot").
    * **Write Access:** Create new failure incident forms. Select location, specify the broken asset, and write contextual descriptions.
    * **Denial Limits:** Absolutely zero visibility into general school metrics, other teachers' tickets, budget allocation data, or user profiles. Cannot alter ticket statuses.

---

## 3. High-Fidelity Verification Flow (Behind the Scenes)

1. **Submission Check:** The user attempts to sign up by inputting their National ID, Role, and Teacher Code/Unified Email.
2. **Pre-Seeded Match:** The system queries the pre-existing school roster:
   ```sql
   SELECT employee_status FROM moe_payroll_registry 
   WHERE national_id = input_id AND school_code = current_school;