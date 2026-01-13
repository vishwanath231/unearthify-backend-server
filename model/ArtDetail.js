const mongoose = require("mongoose");

const ArtDetailSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArtCategory",
      required: true,
    },
    artType: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
    },
    
    // Basic Information
    language: String,
    state: String,
    materials: String,
    region: String,

    // Artists & Performance
    famousArtist: String,
    contemporaryPerformers: String,
    typicalLength: String,
    origin: String,

    // Reference
    websiteLink: String,
  },
  {
    timestamps: true,
  }
);

const ArtDetail = mongoose.model("ArtDetail", ArtDetailSchema);

module.exports = ArtDetail;
