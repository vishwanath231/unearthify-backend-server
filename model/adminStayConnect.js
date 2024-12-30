const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
    {
        titles: {
          type: String, 
        
        },
        descriptions: {
          type: String, 
    
        },
        heading: {
          type: String, 
        
        },
      },
  { timestamps: true }
);
const ConnectStay = mongoose.model('StayConnect', cardSchema);

module.exports = ConnectStay;
