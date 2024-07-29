// Import required modules
const express = require('express');
const path = require('path');
const noCache = require('nocache');
require('dotenv').config();
const Config=require('./config/config')
Config.connectDB()
const cloudinary = require("cloudinary").v2

// Set up Express application
const app = express();
const port = 3009;

cloudinary.config({
  cloud_name:'dbr8upyh3',
  api_key: '793931774182816',
  api_secret: 'HRyisM1O6ItWdNU2x7Y6qtA_gb8',
});


app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


app.use(noCache());

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// User Routes
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);

// Admin Routes
const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);


app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});