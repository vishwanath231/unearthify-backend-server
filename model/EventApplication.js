const mongoose = require("mongoose");

const EventApplicationSchema = new mongoose.Schema({
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    categoryName: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"],
    },
    age: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
     
    },
    gender: {
      type: String,
      required: true, 
     
    },
    address: {
      type: String,
      required: true, 
      trim: true,
    },
   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EventApplication", EventApplicationSchema);
