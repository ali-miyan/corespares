const categoryModel = require("../models/category-model");
const productModel = require("../models/product-model");
const mongoose = require("mongoose");

const loadUserHome = async (req, res) => {
  try {
    const category = await categoryModel.find({ is_blocked: false });
    const product = await productModel.find({ is_blocked: false });
    res.render("home", { category, product });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

const loadUserShop = async (req, res) => {
  try {
    const id = req.params.id;
    let categoryName = "null";
    let product;

    if (id === "0") {
      product = await productModel.find({ is_blocked: false }).populate("categoryId");
    } else if (mongoose.Types.ObjectId.isValid(id)) {
      product = await productModel.find({ categoryId: id, is_blocked: false }).populate("categoryId");
    } else {
      return res.status(400).send("Invalid category ID");
    }

    if (product.length > 0) {
      categoryName = product[0].categoryId.title;
    }

    const categories = await categoryModel.find({ is_blocked: false });

    res.render("products", { product, categoryName, categories });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

const loadUserProducts = async (req, res) => {
  try {
    const productsPerPage = 9;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * productsPerPage;

    const totalProducts = await productModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const products = await productModel
      .find({ is_blocked: false })
      .populate("categoryId")
      .skip(skip)
      .limit(productsPerPage);
    const categories = await categoryModel.find({ is_blocked: false });

    res.render("allProduct", {
      products,
      currentPage: page,
      totalPages,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

const loadProductDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel
      .findOne({ _id: id })
      .populate("categoryId");

    const relatedProducts = await productModel
      .find({
        categoryId: product.categoryId,
        _id: { $ne: id },
      })
      .populate("categoryId");

    res.render("eachProduct", { product, relatedProducts });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

module.exports = {
  loadUserHome,
  loadUserShop,
  loadProductDetails,
  loadUserProducts,
};
