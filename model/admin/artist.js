const mongoose = require("mongoose");

const artistForm = new mongoose.Schema({
  name: {
    type: String,
  },
  artForm: {
    type: String,
  },
  region: {
    type: String,
  },
  bio: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Artist", artistForm);
