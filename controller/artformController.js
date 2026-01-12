const ArtForm = require("../model/ArtForm");

// Create a new artform
const createArtForm = async (req, res) => {
  try {
    const { title, category, description, shortDescription, languages, state, famousArtists, contemporaryPerformers, typicalLength, origin, websiteLinks, route, icon, status } = req.body;
    const image = req.file ? `/api/artFormImage/${req.file.filename}` : null;

    if (!image) {
      return res.status(400).json({ success: false, message: "Image file is required." });
    }

    const newArtForm = new ArtForm({
      category,
      description,
      shortDescription,
      languages,
      state,
      famousArtists,
      contemporaryPerformers,
      typicalLength,
      origin,
      websiteLinks,
      route,
      icon,
      image,
      status: status || "active",
    });

    await newArtForm.save();

    res.status(201).json({
      success: true,
      message: "Art form created successfully",
      data: newArtForm,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating art form", error: error.message });
  }
};

// Get all artforms
const getAllArtForms = async (req, res) => {
  try {
    const artForms = await ArtForm.find().sort({ createdAt: -1 });
    res.json({ success: true, data: artForms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching art forms", error: error.message });
  }
};

// Get artforms by category
const getArtFormsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const artForms = await ArtForm.find({ category }).sort({ createdAt: -1 });
    res.json({ success: true, data: artForms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching art forms by category", error: error.message });
  }
};

// Get artform by ID
const getEventById = async (req, res) => {
    // Wait, the route calls getArtFormById. Let's name it correctly.
}
const getArtFormById = async (req, res) => {
  try {
    const artForm = await ArtForm.findById(req.params.id);
    if (!artForm) {
      return res.status(404).json({ success: false, message: "Art form not found" });
    }
    res.json({ success: true, data: artForm });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching art form", error: error.message });
  }
};

// Get artform by title
const getArtFormByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const artForm = await ArtForm.findOne({ title: new RegExp('^' + title + '$', 'i') });
    if (!artForm) {
      return res.status(404).json({ success: false, message: "Art form not found" });
    }
    res.json({ success: true, data: artForm });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching art form by title", error: error.message });
  }
};

// Update an artform
const updateArtFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/api/artFormImage/${req.file.filename}`;
    }

    const updatedArtForm = await ArtForm.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedArtForm) {
      return res.status(404).json({ success: false, message: "Art form not found" });
    }

    res.json({
      success: true,
      message: "Art form updated successfully",
      data: updatedArtForm,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating art form", error: error.message });
  }
};

// Delete an artform
const deleteArtFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArtForm = await ArtForm.findByIdAndDelete(id);

    if (!deletedArtForm) {
      return res.status(404).json({ success: false, message: "Art form not found" });
    }

    res.json({ success: true, message: "Art form deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting art form", error: error.message });
  }
};

module.exports = {
  createArtForm,
  getAllArtForms,
  getArtFormsByCategory,
  getArtFormById,
  getArtFormByTitle,
  updateArtFormById,
  deleteArtFormById,
};
