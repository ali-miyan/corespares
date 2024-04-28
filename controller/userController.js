const categoryModel = require("../models/category-model");
const productModel = require("../models/product-model");

const loadUserHome = async (req, res) => {
  try {
    const category = await categoryModel.find({ is_blocked: false });
    const product = await productModel.find({ is_blocked: false });
    console.log(product);
    res.render("home", { category ,product});
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

const loadUserShop = async (req, res) => {
  try {
    const id = req.params.id;
    let categoryName = 'null';
    const product = await productModel
      .find({ categoryId: id, is_blocked: false })
      .populate("categoryId");
      if(product.length > 0){
        categoryName = product[0].categoryId.title
      }

    const categories = await categoryModel.find({is_blocked:false})

    res.render("products", { product, categoryName ,categories});
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

    const relatedProducts = await productModel.find({
      categoryId: product.categoryId,
      _id: { $ne: id }
    }).populate("categoryId");

    res.render("eachProduct", { product, relatedProducts });
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
};

module.exports = {
  loadUserHome,
  loadUserShop,
  loadProductDetails,
};
