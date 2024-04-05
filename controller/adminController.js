const categoryModel = require("../models/category-model");
const dotenv = require("dotenv").config();

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
    if (password === process.env.password && email === process.env.email) {
      res.json({ success: true });
    } else if (password !== process.env.password) {
      res.json({ wrongPass: true });
    } else if (email !== process.env.email) {
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
    const { title, description } = req.body;
    const imageUrl = req.file.originalname;

    const existingCategory = await categoryModel.findOne({
      title: { $regex: new RegExp(title, "i") },
    });
    if (existingCategory) {
      res.json({ exits: true });
    }
    const newCategory = new categoryModel({
      title,
      description,
      imageUrl,
    });
    await newCategory.save();
    res.json({ ok: true, message: "Category created successfully" });
  } catch (err) {
    console.error(err);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.body.productId;
    const deleted = await categoryModel.deleteOne({ _id: id });
    if (deleted) {
      res.json({ ok: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const categoryStatus = async (req, res) => {
  try {
    const { categoryId, isBlocked } = req.body;
    const category = await categoryModel.updateOne(
      { _id: categoryId },
      { is_blocked: isBlocked }
    );
    console.log(category, "got is", isBlocked);
  } catch (error) {
    console.log(error);
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
};
