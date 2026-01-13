const ArtDetail = require("../../model/ArtDetail");
const ArtCategory = require("../../model/ArtCategory");

// Create Art Details
const createArtDetail = async (req, res) => {
  try {
    const {
      categoryId,
      artTypeId,
      language,
      state,
      materials,
      region,
      famousArtist,
      contemporaryPerformers,
      typicalLength,
      origin,
      websiteLink,
    } = req.body;

    // Validate Category exists
    const category = await ArtCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Validate Art Type exists in that category
    // Subdocuments have _id
    const artType = category.artTypes.id(artTypeId);
    if (!artType) {
        return res.status(404).json({ success: false, message: "Art Type not found in this category" });
    }

    const newDetail = new ArtDetail({
      category: categoryId,
      artType: artTypeId,
      language,
      state,
      materials,
      region,
      famousArtist,
      contemporaryPerformers,
      typicalLength,
      origin,
      websiteLink,
    });

    await newDetail.save();

    res.status(201).json({
      success: true,
      message: "Art Details added successfully",
      data: newDetail,
    });
  } catch (error) {
    console.error("Error creating art detail:", error);
    res.status(500).json({ success: false, message: "Error creating art detail", error: error.message });
  }
};

const getAllArtDetails = async (req, res) => {
    try {
        // Populate category and find the specific artType subdocument might be hard to populate directly for subdoc properties, 
        // but we can populate 'category'.
        const details = await ArtDetail.find().populate('category').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: details });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching art details", error: error.message });
    }
}

const getArtDetailById = async (req, res) => {
    try {
        const detail = await ArtDetail.findById(req.params.id).populate('category');
        if(!detail) {
             return res.status(404).json({ success: false, message: "Detail not found"});
        }
        res.status(200).json({ success: true, data: detail });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching detail", error: error.message });
    }
}

module.exports = {
  createArtDetail,
  getAllArtDetails,
  getArtDetailById
};
