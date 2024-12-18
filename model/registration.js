const mongoose = require("mongoose");

const Registration = new mongoose.Schema({
  FirstName: { type: String},
  LastName: { type: String},
  UserName: { type: String},
  FamilyName:{type:String},

  Email: { type: String },
  Password: { type: String},
  Pincode:{type:String},
  Country: { type: String },
  State: { type: String},
  City: { type: String},
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  
});

// Register the schema as a model
const RegisterDetails = mongoose.model("regs", Registration);
module.exports = RegisterDetails;
