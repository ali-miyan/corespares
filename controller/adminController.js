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
    const { title, description } = req.body;
    const imageUrl = req.file.filename;

    const existingCategory = await categoryModel.findOne({
      title: { $regex: new RegExp(title, "i") },
    });
    existingCategory
    if (existingCategory) {
      return res.json({ exits: true });
    }
    const newCategory = new categoryModel({
      title,
      description,
      imageUrl,
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
    await categoryModel.updateOne(
      { _id: categoryId },
      { is_blocked: isBlocked }
    );
  } catch (error) {
    console.log(error);
  }
};

const adminLogout = async (req, res) => {
  try {
      req.session.destroy();
      res.redirect('/admin');
  } catch (error) {
      console.log(error.message);
  }
}

module.exports = {
  loadAdminLogin,
  adminLogin,
  loadCategory,
  addCategoryPost,
  addCategory,
  deleteCategory,
  categoryStatus,
  adminLogout
};
