const mongoose = require("mongoose");

const ArtFormSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["dance", "music", "painting", "sculpture", "martial", "drama"],
      trim: true,
    },
    icon: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
    },
    languages: {
      type: String,
    },
    state: {
      type: String,
    },
    famousArtists: {
      type: String,
    },
    contemporaryPerformers: {
      type: String,
    },
    typicalLength: {
      type: String,
    },
    origin: {
      type: String,
    },
    websiteLinks: {
      type: String,
    },
    route: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const ArtForm = mongoose.model("ArtForm", ArtFormSchema);

module.exports = ArtForm;
