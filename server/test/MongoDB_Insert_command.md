// 1. Core Unique Indexes (Enforces data integrity, prevents duplicate signups)
db.staff.createIndex({ "national_id": 1 }, { unique: true });
db.staff.createIndex({ "legal_name": 1 }, { unique: true });
db.staff.createIndex({ "phone": 1 }, { unique: true });
db.staff.createIndex({ "email": 1 }, { unique: true });

// 2. Query Performance Indexes (Speeds up searching/filtering in your app)
db.staff.createIndex({ "school": 1 });
db.staff.createIndex({ "staff_Type": 1 });


db.staff.insertMany([
  {
    "national_id": "29999999999999",
    "legal_name": "AWERDdev",
    "staff_Type": "Super Admin",
    "school": "System Root",
    "email": "AWERD.dev@nasr-school.edu.eg",
    "password": "SuperAdmin2026!",
    "phone": "01000000000"
  },
  {
    "national_id": "27503150101234",
    "legal_name": "Mahmoud Hassan",
    "staff_Type": "Principal",
    "school": "El-Nasr Secondary School",
    "email": "mahmoud.hassan@nasr-school.edu.eg",
    "password": "PrincipalSecurePass2026!",
    "phone": "01061234567"
  },
  {
    "national_id": "29805120105678",
    "legal_name": "Sarah Ali",
    "staff_Type": "Administrator",
    "school": "Future International School",
    "email": "sarah.ali@future-intl.edu.eg",
    "password": "AdminSystemClearance456!",
    "phone": "01556789012"
  },
  {
    "national_id": "28810051403456",
    "legal_name": "Mona Mansour",
    "phone": "01187654321",
    "staff_Type": "Principal",
    "email": "mona.mansour@future-intl.edu.eg",
    "password": "CounselorSupport987!",
    "school": "Future International School"
  },
  {
    "national_id": "29108040209876",
    "legal_name": "Tarek El-Sayed",
    "staff_Type": "Teacher",
    "school": "Future International School",
    "email": "tarek.elsayed@future-intl.edu.eg",
    "password": "TarekStaffSecurePass!",
    "phone": "01098765432"
  }
])