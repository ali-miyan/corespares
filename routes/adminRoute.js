const express = require("express");
const adminRoute = express();
const session = require("express-session");
const admincontrollers = require("../controller/adminController");
const productController = require("../controller/productController");
const upload = require('../middleware/multer')
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
adminRoute.delete("/delete-category",auth.isLogin, admincontrollers.deleteCategory);
adminRoute.patch('/category-status', auth.isLogin,admincontrollers.categoryStatus)
adminRoute.get('/admin-logout',admincontrollers.adminLogout)
adminRoute.post("/add-categories",auth.isLogin,upload.single('image'),admincontrollers.addCategoryPost);
adminRoute.get("/products",auth.isLogin, productController.loadProducts);
adminRoute.get("/add-products",auth.isLogin, productController.loadAddProducts);
adminRoute.post("/add-product",auth.isLogin,upload.array('images'), productController.addProductPost);
adminRoute.get("/edit-product",auth.isLogin, productController.editProduct);
adminRoute.post("/edit-products",auth.isLogin,upload.array('images'), productController.editProductPost);
adminRoute.post('/edit-categories',auth.isLogin,upload.single('image') ,admincontrollers.categoryEdit);
adminRoute.delete("/delete-product",auth.isLogin, productController.deleteProduct);
adminRoute.patch('/product-status',auth.isLogin,productController.productStatus)

module.exports = adminRoute;