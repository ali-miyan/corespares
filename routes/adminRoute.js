const express = require("express");
const adminRoute = express();
const session = require("express-session");
const admincontrollers = require("../controller/adminController");
const productController = require("../controller/productController");
const multer = require("../middleware/multer");
const auth = require('../middleware/auth')


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

adminRoute.get("/",auth.isLogout, admincontrollers.loadAdminLogin);
adminRoute.post("/admin-login",auth.isLogout,admincontrollers.adminLogin);
adminRoute.get("/category", auth.isLogin,admincontrollers.loadCategory);
adminRoute.get("/add-category",auth.isLogin, admincontrollers.addCategory);
adminRoute.post("/add-category", auth.isLogin,admincontrollers.addCategoryPost);
adminRoute.delete("/delete-category",auth.isLogin, admincontrollers.deleteCategory);
adminRoute.patch('/category-status', auth.isLogin,admincontrollers.categoryStatus)
adminRoute.get('/admin-logout',admincontrollers.adminLogout)
adminRoute.get("/", admincontrollers.loadAdminLogin);
adminRoute.post("/admin-login", admincontrollers.adminLogin);
adminRoute.get("/category", admincontrollers.loadCategory);
adminRoute.get("/add-category", admincontrollers.addCategory);
adminRoute.post("/add-categories",multer.uploadproduct,admincontrollers.addCategoryPost);
adminRoute.delete("/delete-category", admincontrollers.deleteCategory);
adminRoute.get("/products", productController.loadProducts);
adminRoute.get("/add-products", productController.loadAddProducts);
adminRoute.post("/add-product",multer.uploadMultiple, productController.addProductPost);
adminRoute.get("/edit-product", productController.editProduct);
adminRoute.post("/edit-products",multer.uploadMultiple, productController.editProductPost);
adminRoute.post('/edit-categories',multer.uploadproduct ,admincontrollers.categoryEdit);
adminRoute.delete("/delete-product", productController.deleteProduct);
adminRoute.patch('/product-status',productController.productStatus)

module.exports = adminRoute;