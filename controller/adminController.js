const categoryModel = require("../models/category-model");
const productModel = require("../models/product-model");

const dotenv = require("dotenv").config();
const fs = require("fs");
const path = require("path");

const loadAdminLogin = async (req, res) => {
  try {
    res.render("admin-login");
  } catch (error) {
    console.log(error);
  }
};

const adminLogin = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (password === process.env.password && email === process.env.gmail) {
      req.session.email = email;
      res.json({ success: true });
    } else if (password !== process.env.password) {
      res.json({ wrongPass: true });
    } else if (email !== process.env.gmail) {
      res.json({ wrongEmail: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const loadCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.render("category", { categories });
  } catch (error) {
    console.log(error);
  }
};

const addCategory = async (req, res) => {
  try {
    res.render("add-category");
  } catch (error) {
    console.log(error);
  }
};

const addCategoryPost = async (req, res) => {
  try {
    console.log(req.body);
    const { title, description ,image} = req.body;
    // const imageUrl = req.file.filename;

    const existingCategory = await categoryModel.findOne({
      title: { $regex: new RegExp(title, "i") },
    });
    existingCategory;
    if (existingCategory) {
      return res.json({ exits: true });
    }
    const newCategory = new categoryModel({
      title,
      description,
      imageUrl:image,
    });
    await newCategory.save();
    return res.json({ ok: true, message: "Category created successfully" });
  } catch (err) {
    console.error(err);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.body.productId;
    const category = await categoryModel.findById(id);
    const imageFilename = category.imageUrl;
    const imagePath = "public/categoryimages/" + imageFilename;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    const deletedCategory = await categoryModel.deleteOne({ _id: id });
    if (deletedCategory.deletedCount === 1) {
      res.json({ ok: true });
    } else {
      res
        .status(500)
        .json({ error: "Failed to delete category from database" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const categoryStatus = async (req, res) => {
  try {
    const { categoryId, isBlocked } = req.body;
    console.log(isBlocked);
    await categoryModel.updateOne(
      { _id: categoryId },
      { is_blocked: !isBlocked }
    );
    await productModel.updateMany({categoryId:categoryId},{isCategoryBlocked:!isBlocked})
  } catch (error) {
    console.log(error);
  }
};

const categoryEdit = async (req, res) => {
  try {
    const { title, description, id , image } = req.body;


console.log(image);
    const category = await categoryModel.updateOne({ _id: id },{title:title,description:description,imageUrl:image});
    res.json({ok:true})
  } catch (error) {
    console.log(error);
  }
};

const adminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadAdminLogin,
  adminLogin,
  loadCategory,
  addCategoryPost,
  addCategory,
  deleteCategory,
  categoryStatus,
  adminLogout,
  categoryEdit,
};
