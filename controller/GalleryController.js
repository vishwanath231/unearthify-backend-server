const Gallery = require('../model/gallery');

// Create a new gallery image
const createGallery = async (req, res) => {
  try {
    const { alt, category } = req.body;
    const imageUrl = req.file ? `/api/galleryImage/${req.file.filename}` : null;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image file is required." });
    }

    const newGalleryData = new Gallery({
      alt,
      category,
      imageUrl,
    });

    const savedGalleryData = await newGalleryData.save();

    res.status(201).json({
      message: "Gallery image created successfully",
      data: savedGalleryData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating gallery image", error });
  }
};

// Get all gallery images
const getGallerys = async (req, res) => {
  try {
    const galleryImages = await Gallery.find();
    res.status(200).json(galleryImages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching galleries', error });
  }
};

// Get gallery images by category
const getGallerysByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const galleryImages = await Gallery.find({ category });
    res.status(200).json(galleryImages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching galleries by category', error });
  }
};

// Get gallery image by ID
const getGalleryById = async (req, res) => {
  const { id } = req.params;
  try {
    const galleryImage = await Gallery.findById(id);
    if (!galleryImage) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }
    res.status(200).json(galleryImage);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery image by ID', error });
  }
};


const updateGalleryById = async (req, res) => {
  const { id } = req.params;
  const { alt, category } = req.body;
  const imageUrl = req.file ? `/api/galleryImage/${req.file.filename}` : null;

  try {
    const updatedGallery = await Gallery.findById(id);

    if (!updatedGallery) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }

    updatedGallery.alt = alt || updatedGallery.alt;
    updatedGallery.category = category || updatedGallery.category;

    if (imageUrl) {
      updatedGallery.imageUrl = imageUrl;
    }

    const savedGallery = await updatedGallery.save();

    res.status(200).json({
      message: 'Gallery image updated successfully',
      gallery: savedGallery,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating gallery image', error });
  }
};



// Delete a gallery image by ID
const deleteGalleryById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedGallery = await Gallery.findByIdAndDelete(id);
    if (!deletedGallery) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }
    res.status(200).json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting gallery image', error });
  }
};

module.exports = {
  createGallery,
  getGallerys,
  getGallerysByCategory,
  getGalleryById,
  updateGalleryById,
  deleteGalleryById,
};
