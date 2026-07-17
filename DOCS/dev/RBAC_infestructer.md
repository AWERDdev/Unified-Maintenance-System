UMES Architectural Logic & Authentication Strategy
1. Authentication & Identity Verification
• Primary Key: 14-digit National ID (الرقم القومي).

• Verification Strategy: Automated lookup against a pre-seeded `mockMoeRegistry` (simulating Ministry of Education staff database).

• Logic: Validate ID -> Check Role consistency -> Grant Access. If mismatch -> Access Denied.

2. Role-Based Access Control (RBAC)
• Hierarchy:

  1. Staff/Teachers (Level 1): Create requests, view own tickets.

  2. IT Admin (Level 2): Technical task assignment, status updates.

  3. Vice Principal (Level 3): Operational review, standard repair verification.

  4. Principal (Level 4): Final budget approval, executive dashboard access.

3. Shared Dashboard Engine (UI Strategy)
• Architecture: Single `/dashboard` route for all users.

• Engine Logic: Conditional rendering based on `user.role` flags.

  • Shared View: Request feed / "Create New Request" modal.

  • Administrative Section: Conditional component `<ManagementConsole />` visible only to IT Admin, VP, and Principal roles.

• Approval Pipeline:

  • Request Created -> State: `pending_review`.

  • Administrative Review -> Action: Approve/Reject -> State: `approved` / `escalated`.

  • Technical Dispatch -> State: `in_progress` -> `resolved`.