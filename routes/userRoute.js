const express = require("express");
const userRoute = express();
const session = require("express-session");
const userController = require('../controller/userController');

userRoute.use(
  session({
    secret: "mysessionsecret",
    resave: false,
    saveUninitialized: true,
  })
);


// Set the view engine and views directory
userRoute.set("views", "./views/user");

userRoute.get('/',userController.loadUserHome);
userRoute.get('/shop',userController.loadUserShop);


module.exports = userRoute;
