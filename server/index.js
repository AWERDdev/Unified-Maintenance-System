const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3500;

app.use(cors({
    
    origin: 'http://localhost:3000',

}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const connect_DB = require("./DB/DB")

connect_DB()

app.get('/', (req, res) => {
  res.json({ message: 'This is the root endpoint Speaking' });
});

const StaffSignup = require("./AUTH/Staff_AUTH_signUP");
const cookieParser = require('cookie-parser');

app.use("/auth",StaffSignup)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//http://localhost:3500/