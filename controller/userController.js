const categoryModel = require("../models/category-model");

const loadUserHome = async (req, res) => {
  try {
    const category = await categoryModel.find({ is_blocked: true });
    console.log(category[0]);
    res.render("home", { category });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

const loadUserShop = async (req, res) => {
  try {
    res.render("products");
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

module.exports = {
  loadUserHome,
  loadUserShop,
};
