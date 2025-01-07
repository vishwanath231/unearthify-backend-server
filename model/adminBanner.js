const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  itemId: { type: String },
  titles: { type: String, required: true },
  descriptions: { type: String, required: true },
  image: { type: String },
});

const cardSchema = new mongoose.Schema(
  { items: [bannerSchema] },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", cardSchema);

module.exports = Banner;
