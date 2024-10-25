const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Image", ImageSchema);
