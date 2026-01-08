const ArtForm = require("../model/artform");

// Create a new artform
const createArtistForm = async (req, res) => {
  try {
    const { name ,artForm , region , bio } = req.body;
    const image = req.file ? `/api/uploadArtistImage/${req.file.filename}` : null;

    if (!image) {
      return res.status(400).json({ message: "Image file is required." });
    }

    const newArtForm = new ArtForm({
      name ,artForm , region , bio
    });

    const savedArtForm = await newArtForm.save();

    res.status(201).json({
      message: "Art form created successfully",
      data: savedArtForm,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating art form", error: error.message });
  }
};

// Get all artforms
const getArtForms = async (req, res) => {
  try {
    const artForms = await ArtForm.find().sort({ createdAt: -1 });
    res.status(200).json(artForms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching art forms", error: error.message });
  }
};

// Update an artform
const updateArtForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, route, icon } = req.body;
    const updateData = { title, description, route, icon };

    if (req.file) {
      updateData.image = `/api/uploadsArtForms/${req.file.filename}`;
    }

    const updatedArtForm = await ArtForm.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedArtForm) {
      return res.status(404).json({ message: "Art form not found" });
    }

    res.status(200).json({
      message: "Art form updated successfully",
      data: updatedArtForm,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating art form", error: error.message });
  }
};

// Delete an artform
const deleteArtForm = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArtForm = await ArtForm.findByIdAndDelete(id);

    if (!deletedArtForm) {
      return res.status(404).json({ message: "Art form not found" });
    }

    res.status(200).json({ message: "Art form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting art form", error: error.message });
  }
};

module.exports = {
  createArtistForm,
  getArtForms,
  updateArtForm,
  deleteArtForm,
};
