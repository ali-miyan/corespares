const { features } = require("process");
const categoryModel = require("../models/category-model");
const productModel = require("../models/product-model");
const { createCanvas, loadImage } = require('canvas');
const fs = require("fs")
const sizeOf = require('image-size');
const sharp = require("sharp");

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

    res.render("edit-products", { categories, products });
  } catch (error) {
    console.log(error);
    res.status(500).render('500');
  }
};



const addProductPost = async (req, res) => {
  try {
    const { title, description, price, quantity, category, feature } = req.body;
    const imageFilenames = req.files.map(file => file.filename);

    for (let i = 0; i < imageFilenames.length; i++) {
      if (imageFilenames[i]) {
        const dimensions = sizeOf(`public/productimages/${imageFilenames[i]}`);
        const { width, height } = dimensions;
        console.log(width, height);

        let canvasWidth;
        let canvasHeight;
        if (width < 200 && height > 500) {
          canvasWidth = 900;
          canvasHeight = 750
        }
        else if (width <= 550 && height <= 550) {
          canvasWidth = 700;
          canvasHeight = 550;
        }
        else if (height <= 300) {
          canvasWidth = 700;
          canvasHeight = 600
        }
        else if (width <= 400) {
          canvasWidth = 800;
          canvasHeight = 600
        }
        else if (height > 1400) {
          canvasWidth = 1800;
          canvasHeight = 1400;
        }
        else {
          canvasWidth = 1500;
          canvasHeight = 1200;
        }

        const image = await loadImage(`public/productimages/${imageFilenames[i]}`);


        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate the position to center the image
        const x = (canvas.width - image.width) / 2;
        const y = (canvas.height - image.height) / 2;

        // Draw the image onto the canvas
        ctx.drawImage(image, x, y);

        // Convert the canvas to a buffer
        const buffer = canvas.toBuffer('image/jpeg');

        // Use Sharp to resize the image
        await sharp(buffer)
          .toFile(`public/sharpimages/${imageFilenames[i]}`);
      }
    }

    const newProduct = new productModel({
      name: title,
      quantity: quantity,
      price: price,
      categoryId: category,
      description: description,
      features: feature,
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
    const { title, description, price, quantity, category, id, feature } = req.body;
    let imageFilenames = [];

    if (req.files && req.files.length > 0) {
      imageFilenames = req.files.map(file => file.filename);
      for (let i = 0; i < imageFilenames.length; i++) {
        if (imageFilenames[i]) {
          // Load the image using Canvas

          const dimensions = sizeOf(`public/productimages/${imageFilenames[i]}`);
          const { width, height } = dimensions;
          console.log(width, height);

          let canvasWidth;
          let canvasHeight;
          if (width < 200 && height > 500) {
            canvasWidth = 900;
            canvasHeight = 750
          }
          else if (width <= 550 && height <= 550) {
            canvasWidth = 700;
            canvasHeight = 550;
          }
          else if (height <= 300) {
            canvasWidth = 700;
            canvasHeight = 600
          }
          else if (width <= 400) {
            canvasWidth = 800;
            canvasHeight = 600
          }
          else if (height > 1400) {
            canvasWidth = 1800;
            canvasHeight = 1400;
          }
          else {
            canvasWidth = 1500;
            canvasHeight = 1200;
          }

          const image = await loadImage(`public/productimages/${imageFilenames[i]}`);


          const canvas = createCanvas(canvasWidth, canvasHeight);
          // Create a new canvas with a white background
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Calculate the position to center the image
          const x = (canvas.width - image.width) / 2;
          const y = (canvas.height - image.height) / 2;

          // Draw the image onto the canvas
          ctx.drawImage(image, x, y);

          // Convert the canvas to a buffer
          const buffer = canvas.toBuffer('image/jpeg');

          // Use Sharp to resize the image
          await sharp(buffer)
            .toFile(`public/sharpimages/${imageFilenames[i]}`);
        }
      }
    } else {
      const existingProduct = await productModel.findById(id);
      if (existingProduct) {
        imageFilenames = existingProduct.images;
      }
    }
    await productModel.findByIdAndUpdate(
      id,
      {
        name: title,
        quantity: quantity,
        price: price,
        categoryId: category,
        description: description,
        features: feature,
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