const categoryModel = require("../models/category-model");
const productModel = require("../models/product-model");

const loadProducts = async (req, res) => {
  try {
    const products = await productModel.find().populate('categoryId')
    res.render("products", { products });
  } catch (error) {
    console.log(error);
  }
};


const loadAddProducts = async (req, res) => {
  try {
    const categories = await categoryModel.find()
    res.render("add-products", { categories });
  } catch (error) {
    console.log(error);
  }
};
const editProduct = async (req, res) => {
  try {
    const id = req.query.id
    const products = await productModel.findOne({ _id: id })
    const categories = await categoryModel.find()

    console.log(categories);
    res.render("edit-products", { categories, products });
  } catch (error) {
    console.log(error);
  }
};



const addProductPost = async (req, res) => {
  try {
    const { title, description, price, quantity, category } = req.body;
    console.log(req.body);
    const imageFilenames = req.files.map(file => file.filename);

    const existingProduct = await productModel.findOne({
      name: { $regex: new RegExp(title, "i") },
    });
    if (existingProduct) {
      return res.json({ exits: true });
    }
    const newProduct = new productModel({
      name: title,
      quantity: quantity,
      price: price,
      categoryId: category,
      description: description,
      images: imageFilenames,
    });
    await newProduct.save();
    return res.json({ ok: true, message: "Category created successfully" });
  } catch (err) {
    console.error(err);
    return res.json({ ok: false, message: "Category created successfully" });
  }
};
const editProductPost = async (req, res) => {
  try {
    const { title, description, price, quantity, category } = req.body;
    console.log(req.body);
    let imageFilenames = [];

    if (req.files && req.files.length > 0) {
      imageFilenames = req.files.map(file => file.filename);
    } else {
      const existingProduct = await productModel.findById(productId);
      if (existingProduct) {
        imageFilenames = existingProduct.images;
      }
    }
    const existingProduct = await productModel.findOne({
      name: { $regex: new RegExp(title, "i") },
    });
    if (existingProduct) {
      return res.json({ exits: true });
    }
    await productModel.findByIdAndUpdate(
      productId,
      {
        name: title,
        quantity: quantity,
        price: price,
        categoryId: category,
        description: description,
        images: imageFilenames,
      },
      { new: true }
    );
    return res.json({ ok: true, message: "Product created successfully" });
  } catch (err) {
    console.error(err);
    return res.json({ ok: false, message: "Product created successfully" });
  }
};

module.exports = {
  loadProducts,
  addProductPost,
  loadAddProducts,
  editProduct,
  editProductPost
}