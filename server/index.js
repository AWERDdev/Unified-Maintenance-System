const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3500;

app.use(cors({
    
    origin: 'http://localhost:3000',

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.json({ message: 'This is the root endpoint Speaking' });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});