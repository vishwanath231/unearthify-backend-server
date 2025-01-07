const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  alt: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['family', 'cricket', 'events'],  // Add more categories as needed
    required: true,
  },
  imageUrl: {
    type: String,
    required: true, // Ensure it's required if it must always be present
  },
}, { timestamps: true });

const Image = mongoose.model('GalleryImage', imageSchema);

module.exports = Image;
