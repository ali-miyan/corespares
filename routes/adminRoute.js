const express = require("express");
const adminRoute = express();
const session = require("express-session");
const admincontrollers = require("../controller/adminController");
const productController = require("../controller/productController");
const multer = require("../middleware/multer");
const multerproduct = require("../middleware/multer-product");

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

adminRoute.get("/", admincontrollers.loadAdminLogin);
adminRoute.post("/admin-login", admincontrollers.adminLogin);
adminRoute.get("/category", admincontrollers.loadCategory);
adminRoute.get("/add-category", admincontrollers.addCategory);
adminRoute.post(
  "/add-category",
  multer.uploadproduct,
  admincontrollers.addCategoryPost
);
adminRoute.delete("/delete-category", admincontrollers.deleteCategory);
adminRoute.get("/products", productController.loadProducts);
adminRoute.get("/add-products", productController.loadAddProducts);
adminRoute.post("/add-products",multerproduct.uploadMultiple, productController.addProductPost);

module.exports = adminRoute;
