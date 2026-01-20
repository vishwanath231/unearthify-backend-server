const mongoose = require("mongoose");

const ArtTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // Path to the uploaded image
    required: true
  },
  imageId: {
    type: String,
    required: true
  },
});

const ArtCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true   // CATEGORY IMAGE
    },
    imageId: {
      type: String,
      required: true
    },
    artTypes: [ArtTypeSchema], // Array of Art Types
  },
  {
    timestamps: true,
  }
);

const ArtCategory = mongoose.model("ArtCategory", ArtCategorySchema);

module.exports = ArtCategory;
