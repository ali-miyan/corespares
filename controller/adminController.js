const categoryModel = require("../models/category-model");
const productModel = require("../models/product-model");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "categories" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    const stream = Readable.from(fileBuffer);
    stream.pipe(uploadStream);
  });
};

const loadAdminLogin = async (req, res) => {
  try {
    res.render("admin-login");
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
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
    res.status(500).render("500");
  }
};

const loadCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.render("category", { categories });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

const addCategory = async (req, res) => {
  try {
    res.render("add-category");
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};
const addCategoryPost = async (req, res) => {
  try {
    const { title, description } = req.body;

    const file = req.file;

    const imageUrl = await uploadToCloudinary(file.buffer);

    const existingCategory = await categoryModel.findOne({
      title: { $regex: new RegExp(title, "i") },
    });

    if (existingCategory) {
      return res.json({ exists: true });
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
    res.status(500).render("500");
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
    res.status(500).render("500");
  }
};

const categoryStatus = async (req, res) => {
  try {
    const { categoryId, isBlocked } = req.body;
    await categoryModel.updateOne(
      { _id: categoryId },
      { is_blocked: !isBlocked }
    );
    await productModel.updateMany(
      { categoryId: categoryId },
      { isCategoryBlocked: !isBlocked }
    );
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

const categoryEdit = async (req, res) => {
  try {
    const { title, description, id } = req.body;
    let imageUrlToUpdate = null;

    if (req.file) {
      imageUrlToUpdate = await uploadToCloudinary(req.file.buffer);
    } else {
      const existingCategory = await categoryModel.findById(id);
      if (existingCategory) {
        imageUrlToUpdate = existingCategory.image;
      }
    }

    await categoryModel.updateOne(
      { _id: id },
      { title: title, description: description, imageUrl: imageUrlToUpdate }
    );
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};
const adminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
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
