
# Unified Maintenance System

A modern, clean web app for managing maintenance requests with role-based access control. Built for schools and organizations to streamline maintenance workflows.

🚀 **Live Demo**: [https://unifiedmaintenance.vercel.app/](https://unifiedmaintenance.vercel.app/)


## What it does

- **Ticket Management**: Create, view, and track maintenance requests with status updates
- **Role-Based Access Control**: Three user roles with different permissions:
  - Teacher: Create and view tickets
  - Admin: Manage all tickets and staff
  - Principal Funding: Oversee financial aspects
- **Bilingual Support**: English and Arabic interfaces
- **Secure Authentication**: JWT-based login/signup with bcrypt password hashing
- **Real-time-ish updates**: Smooth user experience with modern frontend


## Documentation & Guides

Check out our detailed docs in the `DOCS/` folder:

- [Architecture Overview](DOCS/architecture_overview.md)
- [Security & Performance](DOCS/security_and_performance.md)
- [File by File Review](DOCS/file_by_file_review.md)
- [Final Evaluation](DOCS/final_evaluation.md)

### Dev Docs
- [Project Idea](DOCS/dev/project_idea.md)
- [Maintenance Breakdown](DOCS/dev/maintanince_breakdown.md)
- [RBAC Infrastructure](DOCS/dev/RBAC_infestructer.md)
- [Methods Verification](DOCS/dev/methods_verfication.md)

### Presentations
- [English Presentation](DOCS/presentation/project_presentation_en.md)
- [Arabic Presentation](DOCS/presentation/project_presentation_ar.md)


## Quickstart / Local Setup

Want to run it locally? Let's go!

### Prerequisites
- Node.js installed
- MongoDB running locally or a MongoDB Atlas account

### Step 1: Clone the repo
```bash
git clone &lt;repo-url&gt;
cd Unified-Maintenance-System
```

### Step 2: Set up the server
```bash
cd server
npm install
# Copy .env.template to .env and fill in your values
cp .env.template .env
```

### Step 3: Set up the client
```bash
cd ../client
npm install
```

### Step 4: Run both services
In one terminal (server):
```bash
cd server
npm run devstart
```

In another terminal (client):
```bash
cd client
npm run dev
```

Open your browser and go to `http://localhost:3000`!


## Tech Stack

### Frontend
- **Next.js 16**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Styling
- **Lucide React**: Icons

### Backend
- **Express.js 5**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **Zod**: Input validation
- **Helmet**: Security headers
- **express-rate-limit**: Rate limiting


