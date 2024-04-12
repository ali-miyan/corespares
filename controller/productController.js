const categoryModel = require("../models/category-model");
const productModel = require("../models/product-model");
const fs = require("fs")

const loadProducts = async (req, res) => {
  try {
    const products = await productModel.find().populate('categoryId')
    res.render("products", { products });
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
};


const loadAddProducts = async (req, res) => {
  try {
    const categories = await categoryModel.find()
    res.render("add-products", { categories });
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
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
    res.status(500).render('500');
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
    res.status(500).render('500');
    return res.json({ ok: false, message: "Category created successfully" });
  }
};
const editProductPost = async (req, res) => {
  try {
    const { title, description, price, quantity, category, id } = req.body;
    console.log(req.body, 'ssssssss');
    console.log(req.files, 'ssssssss');
    let imageFilenames = [];

    if (req.files && req.files.length > 0) {
      imageFilenames = req.files.map(file => file.filename);
    } else {
      const existingProduct = await productModel.findById(id);
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
      id,
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
    res.status(500).render('500');
    return res.json({ ok: false, message: "Product created successfully" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.body.productId;
    const product = await productModel.findById(id);
    const imageFilenames = product.images;
    imageFilenames.forEach(imageFilename => {
      const imagePath = "public/productimages/" + imageFilename;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    const deletedProduct = await productModel.deleteOne({ _id: id });
    if (deletedProduct.deletedCount === 1) {
      res.json({ ok: true });
    } else {
      res
        .status(500)
        .json({ error: "Failed to delete Product from database" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
    res.status(500).json({ error: "Internal server error" });
  }
};

const productStatus = async (req, res) => {
  try {
    const { productId, isBlocked } = req.body;
    console.log(isBlocked);
    await productModel.updateOne(
      { _id: productId },
      { is_blocked: !isBlocked }
    );
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
};

module.exports = {
  loadProducts,
  addProductPost,
  loadAddProducts,
  editProduct,
  editProductPost,
  deleteProduct,
  productStatus
}