const mongoose = require("mongoose");

const Request = new mongoose.Schema({
  Email: { type: String },
  Password: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

// Register the schema as a model
const RequestData = mongoose.model("Request", Request);
module.exports = RequestData;
