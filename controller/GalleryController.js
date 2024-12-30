const Gallery = require('../model/gallery');

// Create a new Gallery
const createGallery = async (req, res) => {
  try {
    const { src, alt, category } = req.body;
    const newGallery = new Gallery({ src, alt, category });
    await newGallery.save();
    res.status(201).json({ message: 'Gallery created successfully', Gallery: newGallery });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Gallery', error });
  }
};

// Get all Gallerys
const getGallerys = async (req, res) => {
  try {
    const Gallerys = await Gallery.find();
    res.status(200).json(Gallerys);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Gallerys', error });
  }
};

// Get Gallerys by category
const getGallerysByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const Gallerys = await Gallery.find({ category });
    res.status(200).json(Gallerys);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Gallerys by category', error });
  }
};

// Update an Gallery
const updateGallery = async (req, res) => {
  const { id } = req.params;
  const { src, alt, category } = req.body;
  try {
    const updatedGallery = await Gallery.findByIdAndUpdate(id, { src, alt, category }, { new: true });
    if (!updatedGallery) {
      return res.status(404).json({ message: 'Gallery not found' });
    }
    res.status(200).json({ message: 'Gallery updated successfully', Gallery: updatedGallery });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Gallery', error });
  }
};

// Delete an Gallery
const deleteGallery = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedGallery = await Gallery.findByIdAndDelete(id);
    if (!deletedGallery) {
      return res.status(404).json({ message: 'Gallery not found' });
    }
    res.status(200).json({ message: 'Gallery deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Gallery', error });
  }
};

module.exports = {
  createGallery,
  getGallerys,
  getGallerysByCategory,
  updateGallery,
  deleteGallery,
};
