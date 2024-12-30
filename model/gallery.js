const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['family', 'cricket', 'events'],  // Add more categories as needed
    required: true,
  },
}, { timestamps: true });

const Image = mongoose.model('GalleryImage', imageSchema);

module.exports = Image;
