const mongoose = require("mongoose");

const artFormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Filename of the uploaded image
    required: true,
  },
  icon: {
    type: String,
  },
  route: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ArtForm", artFormSchema);
