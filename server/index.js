require("dotenv").config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { generalLimiter } = require("./middlewares/rate_limiter/rate_limiter");

const app = express();
const port = process.env.PORT || 3500;

// 1. Security & Global Utility Framework Elements
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. Global Baseline Rate Protection (Protects ALL routes, including auth)
app.use(generalLimiter);

// 3. Database Initializer Link Execution 
const connect_DB = require("./DB/DB");
connect_DB();

// 4. Routes Subsystem
app.get('/', (req, res) => {
  res.json({ message: 'This is the root endpoint Speaking' });
});

const StaffSignup = require("./AUTH/Staff_AUTH_signUP");
const StaffLogin = require("./AUTH/Staff_Auth_logIN");
const authMe = require("./AUTH/is_auth");

app.use("/auth", StaffSignup);
app.use("/auth", StaffLogin);
app.use("/auth", authMe);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});