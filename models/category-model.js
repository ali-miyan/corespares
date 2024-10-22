const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("categoryModel", categorySchema);
