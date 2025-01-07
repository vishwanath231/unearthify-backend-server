const mongoose = require("mongoose");

const cardItemSchema = new mongoose.Schema({
  itemId: {
    type: String, // Unique identifier for each item
    required: true,
  },
  title: String,
  description: String,
  heading: String,
});

const cardSchema = new mongoose.Schema(
  {
    items: [cardItemSchema], // Array of items
  },
  { timestamps: true }
);

const ConnectStay = mongoose.model("StayConnect", cardSchema);

module.exports = ConnectStay;
