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
    res.status(500).render('500');
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
    res.status(500).render('500');
  }
};

const loadCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.render("category", { categories });
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
};

const addCategory = async (req, res) => {
  try {
    res.render("add-category");
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
};

const addCategoryPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file;

    const existingCategory = await categoryModel.findOne({
      title: { $regex: new RegExp(title, "i") },
    });
    if (existingCategory) {
      return res.json({ exits: true });
    }
    const newCategory = new categoryModel({
      title,
      description,
      imageUrl: imageUrl.filename,
    });
    await newCategory.save();
    return res.json({ ok: true, message: "Category created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).render('500');
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.body.productId;
    const category = await categoryModel.findById(id);
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
    res.status(500).render('500');
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
    await productModel.updateMany({ categoryId: categoryId }, { isCategoryBlocked: !isBlocked })
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
};

const categoryEdit = async (req, res) => {
  try {
    const { title, description, id } = req.body;
    console.log(req.body, req.file);
    let imageUrlToUpdate = null;

    if (req.file) {
      imageUrlToUpdate = req.file.filename;
    } else {
      const existingCategory = await categoryModel.findById(id);
      if (existingCategory) {
        imageUrlToUpdate = existingCategory.image;
      }
    }

    await categoryModel.updateOne({ _id: id }, { title: title, description: description, imageUrl: imageUrlToUpdate });
    res.json({ ok: true });

  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
};
const adminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
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
