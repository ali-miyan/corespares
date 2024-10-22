const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  categoryId: {
    type: ObjectId,
    ref: "categoryModel",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: String,
    required: true,
  },
  images: [],
  is_blocked: {
    type: Boolean,
    default: false,
    required: true,
  },
  isCategoryBlocked: {
    type: Boolean,
    default: false,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
