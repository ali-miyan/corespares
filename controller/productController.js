const { features } = require("process");
const categoryModel = require("../models/category-model");
const productModel = require("../models/product-model");
const { createCanvas, loadImage } = require('canvas');
const fs = require("fs")
const sizeOf = require('image-size');
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
const { Readable } = require('stream');


const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'products' }, // Specify your folder name here
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

    // Ensure files are uploaded with multer before this function is called
    const files = req.files; // Array of files uploaded

    // Array to store image URLs
    const imageUrls = [];

    // Process and upload each image
    for (const file of files) {
      if (file.buffer) {
        // Get dimensions of the image
        const dimensions = sizeOf(file.buffer);
        const { width, height } = dimensions;
        
        let canvasWidth, canvasHeight;

        // Determine canvas size based on image dimensions
        if (width < 200 && height > 500) {
          canvasWidth = 900;
          canvasHeight = 750;
        } else if (width <= 550 && height <= 550) {
          canvasWidth = 700;
          canvasHeight = 550;
        } else if (height <= 300) {
          canvasWidth = 700;
          canvasHeight = 600;
        } else if (width <= 400) {
          canvasWidth = 800;
          canvasHeight = 600;
        } else if (height > 1400) {
          canvasWidth = 1800;
          canvasHeight = 1400;
        } else {
          canvasWidth = 1500;
          canvasHeight = 1200;
        }

        // Load image
        const image = await loadImage(file.buffer);

        // Create canvas and draw the image
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate position to center image
        const x = (canvas.width - image.width) / 2;
        const y = (canvas.height - image.height) / 2;

        // Draw image onto canvas
        ctx.drawImage(image, x, y);

        // Convert canvas to buffer
        const buffer = canvas.toBuffer('image/jpeg');

        // Use Sharp to process the image further (if needed)
        const processedBuffer = await sharp(buffer).toBuffer();

        // Upload the processed image to Cloudinary
        const imageUrl = await uploadToCloudinary(processedBuffer);
        imageUrls.push(imageUrl);
      }
    }

    // Create and save new product
    const newProduct = new productModel({
      name: title,
      quantity: quantity,
      price: price,
      categoryId: category,
      description: description,
      features: feature,
      images: imageUrls, // Store the URLs of the uploaded images
    });

    await newProduct.save();
    return res.json({ ok: true, message: "Product created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).render('500');
    return res.json({ ok: false, message: "Failed to create product" });
  }
};
const editProductPost = async (req, res) => {
  try {
    const { title, description, price, quantity, category, id, feature } = req.body;
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const files = req.files; // Array of uploaded files

      // Process and upload each image
      for (const file of files) {
        if (file.buffer) {
          // Get dimensions of the image
          const dimensions = sizeOf(file.buffer);
          const { width, height } = dimensions;
          console.log(width, height);

          let canvasWidth, canvasHeight;

          // Determine canvas size based on image dimensions
          if (width < 200 && height > 500) {
            canvasWidth = 900;
            canvasHeight = 750;
          } else if (width <= 550 && height <= 550) {
            canvasWidth = 700;
            canvasHeight = 550;
          } else if (height <= 300) {
            canvasWidth = 700;
            canvasHeight = 600;
          } else if (width <= 400) {
            canvasWidth = 800;
            canvasHeight = 600;
          } else if (height > 1400) {
            canvasWidth = 1800;
            canvasHeight = 1400;
          } else {
            canvasWidth = 1500;
            canvasHeight = 1200;
          }

          // Load image
          const image = await loadImage(file.buffer);

          // Create canvas and draw the image
          const canvas = createCanvas(canvasWidth, canvasHeight);
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Calculate position to center image
          const x = (canvas.width - image.width) / 2;
          const y = (canvas.height - image.height) / 2;

          // Draw image onto canvas
          ctx.drawImage(image, x, y);

          // Convert canvas to buffer
          const buffer = canvas.toBuffer('image/jpeg');

          // Use Sharp to process the image further (if needed)
          const processedBuffer = await sharp(buffer).toBuffer();

          // Upload the processed image to Cloudinary
          const imageUrl = await uploadToCloudinary(processedBuffer);
          imageUrls.push(imageUrl);
        }
      }
    } else {
      // If no new files, use existing images
      const existingProduct = await productModel.findById(id);
      if (existingProduct) {
        imageUrls = existingProduct.images;
      }
    }

    // Update the product with new details
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name: title,
        quantity: quantity,
        price: price,
        categoryId: category,
        description: description,
        features: feature,
        images: imageUrls, // Update images with new URLs
      },
      { new: true }
    );

    return res.json({ ok: true, message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).render('500');
    return res.json({ ok: false, message: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.body.productId;
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