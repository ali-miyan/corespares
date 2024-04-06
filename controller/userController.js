const categoryModel = require("../models/category-model");
const productModel = require("../models/product-model");

const loadUserHome = async (req, res) => {
  try {
    const category = await categoryModel.find({ is_blocked: true });
    res.render("home", { category });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

loadUserShop = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel
      .find({ categoryId: id })
      .populate("categoryId");
    res.render("products", { product });
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
    res.render("eachProduct", { product });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadUserHome,
  loadUserShop,
  loadProductDetails,
};
