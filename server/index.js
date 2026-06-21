const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // 1. Moved to the top
const app = express();
const port = process.env.PORT || 3500;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 2. Now this will work perfectly!

// Database
const connect_DB = require("./DB/DB");
connect_DB();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'This is the root endpoint Speaking' });
});

const StaffSignup = require("./AUTH/Staff_AUTH_signUP");
app.use("/auth", StaffSignup);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});