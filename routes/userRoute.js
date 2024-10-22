const express = require("express");
const userRoute = express();
const session = require("express-session");
const userController = require("../controller/userController");

userRoute.use(
  session({
    secret: "mysessionsecret",
    resave: false,
    saveUninitialized: true,
  })
);

userRoute.set("views", "./views/user");

userRoute.get("/", userController.loadUserHome);
userRoute.get("/shop/:id", userController.loadUserShop);
userRoute.get("/shop", userController.loadUserProducts);
userRoute.get("/product-details/:id", userController.loadProductDetails);

module.exports = userRoute;
