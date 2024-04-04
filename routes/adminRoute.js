const express = require("express");
const adminRoute = express();
const session = require("express-session");
const admincontrollers = require('../controller/adminController');
const multer = require('../middleware/multer')

adminRoute.use(
  session({
    secret: "mysessionsecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Parse JSON and URL-encoded data
adminRoute.use(express.json());
adminRoute.use(express.urlencoded({ extended: true }));

// Set the view engine and views directory
adminRoute.set("views", "./views/admin");

adminRoute.get('/',admincontrollers.loadAdminLogin);
adminRoute.post('/admin-login',admincontrollers.adminLogin)
adminRoute.get('/category',admincontrollers.loadCategory);
adminRoute.get('/add-category',admincontrollers.addCategory);
adminRoute.post('/add-category',multer.uploadproduct,admincontrollers.addCategoryPost);



module.exports = adminRoute;
