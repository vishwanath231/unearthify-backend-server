const mongoose = require("mongoose");

const Registration = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  UserName: String,
  Email: {
    type: String, // Specify the data type for the email field
    required: true, // Ensure the email is required
    unique: true, // Enforce email uniqueness in the database
  },
  Password: {
    type: String,
    required: true, // Ensure the password is required
  },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
});

// Register the schema as a model
const RegisterDetails = mongoose.model("regs", Registration);
module.exports = RegisterDetails;
