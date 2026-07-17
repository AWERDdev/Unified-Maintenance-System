// 1. Create the tickets collection explicitly
db.createCollection("tickets");

// 2. Build Query Performance Indexes (Speeds up operational dashboards)
db.tickets.createIndex({ "school": 1 });
db.tickets.createIndex({ "status": 1 });
db.tickets.createIndex({ "category": 1 });
db.tickets.createIndex({ "createdBy": 1 });

// 3. Build a Compound Index (Optimizes lookups filtering school and status simultaneously)
db.tickets.createIndex({ "school": 1, "status": 1 });



db.tickets.insertMany([
  {
    "asset": "Projector Delta-5",
    "room": "Lab 204",
    "category": "Hardware",
    "status": "Pending_Approval",
    "arCategory": "Maintenance",
    "adminApproved": false,
    "principalFunded": false,
    "cost": 1500,
    "school": "El-Nasr Secondary School",
    "createdBy": ObjectId("65cb8f000000000000000001")
  },
  {
    "asset": "Air Conditioning Unit Central Compressor",
    "room": "Main Examination Hall",
    "category": "Infrastructure",
    "status": "Pending_Approval",
    "arCategory": "بنية تحتية",
    "adminApproved": false,
    "principalFunded": false,
    "cost": 12500,
    "school": "Future International School",
    "createdBy": ObjectId("65cb8f000000000000000001")
  },
  {
    "asset": "Interactive Whiteboard Smart-Touch 4K",
    "room": "Physics Lab B",
    "category": "Hardware",
    "status": "Pending_Approval",
    "arCategory": "أجهزة برمجية",
    "adminApproved": false,
    "principalFunded": false,
    "cost": 4200,
    "school": "Al-Ahram Language School",
    "createdBy": ObjectId("65cb8f000000000000000001")
  },
  {
    "asset": "Exposed Wire Junction Box Repair",
    "room": "Chemistry Lab Prep Room",
    "category": "Electrical",
    "status": "Pending_Approval",
    "arCategory": "كهرباء",
    "adminApproved": false,
    "principalFunded": false,
    "cost": 350,
    "school": "El-Nasr Secondary School",
    "createdBy": ObjectId("65cb8f000000000000000001")
  },
  {
    "asset": "Teacher Demonstration Desk and 30 Student Chairs",
    "room": "Room 105",
    "category": "Infrastructure",
    "status": "Pending_Approval",
    "arCategory": "بنية تحتية",
    "adminApproved": false,
    "principalFunded": false,
    "cost": 8500,
    "school": "Future International School",
    "createdBy": ObjectId("65cb8f000000000000000001")
  },
  {
    "asset": "Cisco Core Network Switch (PoE Faulty)",
    "room": "Server Closet - Admin Block",
    "category": "Hardware",
    "status": "Pending_Approval",
    "arCategory": "أجهزة برمجية",
    "adminApproved": false,
    "principalFunded": false,
    "cost": 6100,
    "school": "Al-Ahram Language School",
    "createdBy": ObjectId("65cb8f000000000000000001")
  },
  {
    "asset": "Leaking Main Water Valve and Piping",
    "room": "Staff Restroom 2nd Floor",
    "category": "Infrastructure",
    "status": "Pending_Approval",
    "arCategory": "بنية تحتية",
    "adminApproved": false,
    "principalFunded": false,
    "cost": 750,
    "school": "El-Nasr Secondary School",
    "createdBy": ObjectId("65cb8f000000000000000001")
  },
  {
    "asset": "Barcode Scanner and Inventory Thermal Printer",
    "room": "Central Library Office",
    "category": "Hardware",
    "status": "Pending_Approval",
    "arCategory": "أجهزة برمجية",
    "adminApproved": false,
    "principalFunded": false,
    "cost": 1200,
    "school": "Future International School",
    "createdBy": ObjectId("65cb8f000000000000000001")
  },
  {
    "asset": "Fluorescent LED Tube Array Overhaul (12 Units)",
    "room": "Gymnasium / Sports Hall",
    "category": "Electrical",
    "status": "Pending_Approval",
    "arCategory": "كهرباء",
    "adminApproved": false,
    "principalFunded": false,
    "cost": 1800,
    "school": "Al-Ahram Language School",
    "createdBy": ObjectId("65cb8f000000000000000001")
  },
  {
    "asset": "3D Printer Extruder Assembly & Heated Bed Replacement",
    "room": "STEM Innovation Studio",
    "category": "Hardware",
    "status": "Pending_Approval",
    "arCategory": "أجهزة برمجية",
    "adminApproved": false,
    "principalFunded": false,
    "cost": 3100,
    "school": "El-Nasr Secondary School",
    "createdBy": ObjectId("65cb8f000000000000000001")
  },
  {
    "asset": "Broken Window Glass Pane & Security Latch",
    "room": "Room 312",
    "category": "Infrastructure",
    "status": "Pending_Approval",
    "arCategory": "بنية تحتية",
    "adminApproved": false,
    "principalFunded": false,
    "cost": 900,
    "school": "Future International School",
    "createdBy": ObjectId("65cb8f000000000000000001")
  }
])

// Ensure count shows 11 documents
db.tickets.countDocuments()

// Pull indices back to verify performance status
db.tickets.getIndexes()