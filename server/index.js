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

// 1. Define allowed origins based on the environment
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://unifiedmaintenance.vercel.app'] // Production only (No trailing slash!)
  : ['http://localhost:3000', 'http://127.0.0.1:3000']; // Development origins

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various Smart TVs) choke on 204
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

// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"