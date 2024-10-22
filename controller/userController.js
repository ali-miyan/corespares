const categoryModel = require("../models/category-model");
const productModel = require("../models/product-model");
const mongoose = require("mongoose");

const loadUserHome = async (req, res) => {
  try {
    const category = await categoryModel.find({ is_blocked: false });
    const product = await productModel.find({ is_blocked: false }).limit(10);
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
      product = await productModel
        .find({ is_blocked: false })
        .populate("categoryId");
    } else if (mongoose.Types.ObjectId.isValid(id)) {
      product = await productModel
        .find({ categoryId: id, is_blocked: false })
        .populate("categoryId");
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

    const totalProductsResult = await productModel.aggregate([
      { $match: { is_blocked: false } },
      {
        $group: {
          _id: "$name",
        },
      },
      {
        $count: "totalProducts",
      },
    ]);

    const totalProducts =
      totalProductsResult.length > 0 ? totalProductsResult[0].totalProducts : 0;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const products = await productModel.aggregate([
      { $match: { is_blocked: false } },
      { $sort: { name: 1 } },
      {
        $group: {
          _id: "$name",
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "doc.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $skip: skip },
      { $limit: productsPerPage },
      {
        $replaceRoot: { newRoot: "$doc" },
      },
    ]);

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
