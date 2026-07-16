# Unified Maintenance System (UMS) - Project Logic & Workflow

## Part 1: How School Maintenance Actually Works in Egypt

### 1. Who reports the problem?
The teacher or the classroom supervisor is the first to notice the broken item (e.g., a smart board or interactive screen). They report it to the school's **IT Specialist (أخصائي التطوير التكنولوجي)** or the **Facilities Supervisor (مسؤول المبنى/الصيانة)**.  

### 2. Can the school just hire anyone?
**Absolutely not.** Public schools cannot hire private contractors or buy whatever they want.  
* **Specialized Ed-Tech:** For specialized educational technology (like smart boards, servers, or school tablets), maintenance is strictly handled by the **Technological Development Department (إدارة التطوير التكنولوجي)** at the Educational Administration (الادارة التعليمية) level, or through official warranty agents contracted by the Ministry of Education.  
* **General Infrastructure:** For general building maintenance (walls, electricity, plumbing), it goes to the **General Authority for Educational Buildings (هيئة الأبنية التعليمية)**.  

### 3. Where does the paperwork go?
It flows upwards:
1. The IT specialist inspects the device.  
2. If they can't fix it locally, they write a formal request paper (**دفتر الأعطال** or a maintenance log).
3. The **School Principal (مدير المدرسة)** signs and stamps it.
4. The paper is sent to the **Educational Administration (الإدارة التعليمية)** in Faiyum.  
5. The Administration dispatches an authorized government engineer or contacts the official maintenance contractor (like *Promethean* or the military production factory that supplied the boards) to fix it.  

---

## Part 2: Refining Your System's Logic and Roles

To make your "Unified Maintenance System" both logical and realistic for a government-scale platform, we should redefine your user roles and ticket workflow.

### Recommended User Roles
Instead of "Special IT Users" and "Admins," structure your roles like this based on actual government entities:
* **Teacher (المعلم):** Can submit a complaint/ticket detailing what is broken in their classroom (e.g., "Smart board in Class 2/1 has a broken HDMI port").  
* **School IT Specialist (أخصائي التطوير):** Validates the ticket. They perform a basic assessment (e.g., "Confirmed: HDMI port is physically damaged; needs external repair").  
* **School Principal (مدير المدرسة):** Approves/signs off on the request to escalate it. *Note: The principal does not "fund" it from their pocket; they approve the formal escalation to the government.*  
* **Government/Administration Admin (مسؤول الإدارة التعليمية):** The external admin who sees the approved school ticket and assigns it to an authorized government maintenance team or contractor.

---

## Part 3: The Logical Ticket Workflow

Here is the exact sequence your backend logic should follow to mirror real-life administrative steps:

1. **Ticket Creation (Teacher / Staff):** A teacher logs in (automatically associated with their school via Government ID). They file a complaint about a broken classroom asset.
2. **Technical Assessment (School IT Specialist):** The School IT Specialist receives the ticket. They inspect the physical issue and write a brief report confirming if it requires external technical intervention.
3. **Administrative Approval (School Principal):** The Principal reviews the assessed ticket and officially signs off/approves it, which electronically "stamps" the request and pushes it to the educational district level.
4. **Assignment (District Admin):** An admin at the Educational Administration reviews the request and assigns it to either an in-house government maintenance technician or the authorized vendor under warranty.
5. **Completion and Verification (School IT & Vendor):** Once the technician repairs the item on-site, the technician marks it as complete. The School IT Specialist must inspect the repair and physically close the ticket.

---

## Part 4: Database Relationship Architecture

Since you want the site to automatically resolve the user's school based on their national Government ID (الرقم القومي), your database schema needs to look up users against a pre-registered government registry.

| Collection / Table | Key Fields | Purpose |
| :--- | :--- | :--- |
| **`GovernmentRegistry`** | `NationalID` (PK), `FullName`, `Role`, `SchoolID` | Pre-seeded government database used to verify identity during signup. |
| **`Users`** | `UserID` (PK), `NationalID` (FK), `Email`, `ActiveRole` | Active accounts. Roles: `Teacher`, `IT`, `Principal`, `DistrictAdmin`. |
| **`Schools`** | `SchoolID` (PK), `SchoolName` (e.g., Gamal Abdel Nasser), `AdministrationID` | Details of the schools. |
| **`Tickets`** | `TicketID` (PK), `SchoolID` (FK), `CreatedBy` (FK), `Status` | `Status` transitions: `Draft` ➔ `Assessed` ➔ `Approved` ➔ `Assigned` ➔ `Completed`. |