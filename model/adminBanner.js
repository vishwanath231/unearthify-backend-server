const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    titles: {
      type: [String], 
      required: true,
    },
    descriptions: {
      type: [String], 
      required: true,
    },
    image: {
      type: [String], 
    },
  },
  { timestamps: true } 
);



// Create the model based on the schema
const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
