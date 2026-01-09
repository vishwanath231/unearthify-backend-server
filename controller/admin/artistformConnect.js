const Artist = require("../../model/admin/artist");

// Create a new ArtistForm
const createArtistForm = async (req, res) => {
  try {
    const { name ,ArtistForm , region , bio } = req.body;
    const image = req.file ? `/api/uploadArtistImage/${req.file.filename}` : null;
    if (!image) {
      return res.status(400).json({ message: "Image file is required." });
    }
    const newArtistForm = new Artist({
      name ,ArtistForm , region , bio
    });
    const savedArtistForm = await newArtistForm.save();

    res.status(201).json({
      message: "Art form created successfully",
      data: savedArtistForm,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating art form", error: error.message });
  }
};

// Get all ArtistForms
const getArtistForms = async (req, res) => {
  try {
    const artistForm = await Artist.find().sort({ createdAt: -1 });
    res.status(200).json(artistForm);
  } catch (error) {
    res.status(500).json({ message: "Error fetching art forms", error: error.message });
  }
};

// Update an ArtistForm
const updateArtistForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, route, icon } = req.body;
    const updateData = { title, description, route, icon };

    if (req.file) {
      updateData.image = `/api/uploadArtistImage/${req.file.filename}`;
    }

    const updatedArtistForm = await Artist.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedArtistForm) {
      return res.status(404).json({ message: "Art form not found" });
    }

    res.status(200).json({
      message: "Art form updated successfully",
      data: updatedArtistForm,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating art form", error: error.message });
  }
};

// Delete an ArtistForm
const deleteArtistForm = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArtistForm = await Artist.findByIdAndDelete(id);

    if (!deletedArtistForm) {
      return res.status(404).json({ message: "Art form not found" });
    }

    res.status(200).json({ message: "Art form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting art form", error: error.message });
  }
};

module.exports = {
  createArtistForm,
  getArtistForms,
  updateArtistForm,
  deleteArtistForm,
};
