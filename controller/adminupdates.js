const fs = require('fs');
const path = require('path');
const Banner = require('../model/adminBanner'); // Import the Banner model

// Upload Banner Data (POST)
const uploadBannerData = async (req, res) => {
  try {
    const { titles, descriptions } = req.body;

    // // Validate and check if a file exists
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    // Get the uploaded file path
    const image = req.file ?`/uploadsBanner/${req.file.filename}`:null;

    // Log for debugging
    console.log("Uploaded file:", req.file);

    // Create a new banner document
    const newBanner = new Banner({
      titles: titles,
      descriptions: descriptions,
      images: image,
    });

    // Save the banner to the database
    await newBanner.save();

    res.status(200).json({
      message: "Banner data and image uploaded successfully!",
      banner: newBanner,
    });
  } catch (error) {
    console.error("Error in uploadBannerData:", error);
    res.status(500).json({ message: "Error uploading banner data." });
  }
};




// Get all banners (GET)
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({
      message: 'All banners retrieved successfully.',
      banners,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching banners.' });
  }
};

// Get banner by ID (GET)
const getBannerById = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }

    res.status(200).json({
      message: 'Banner found.',
      banner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching banner.' });
  }
};

// Update Banner Data (PUT)
const updateBannerData = async (req, res) => {
  const { id } = req.params;
  const { titles, descriptions } = req.body;

  try {
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }

    // If new titles, descriptions, and files are provided, update them
    if (titles && descriptions) {
      // Validate titles and descriptions are arrays and have the same length as files
      if (!Array.isArray(titles) || !Array.isArray(descriptions) || titles.length !== descriptions.length || titles.length !== req.files.length) {
        return res.status(400).json({ message: 'Titles, descriptions, and images must be arrays of the same length.' });
      }

      // Map the uploaded files to image names
      const images = req.files.map(file => file.filename);

      // Update banner with the new values
      banner.titles = titles;
      banner.descriptions = descriptions;
      banner.images = images;
    }

    // Save the updated banner
    await banner.save();

    res.status(200).json({
      message: 'Banner updated successfully!',
      banner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating banner data.' });
  }
};

// Delete Banner Data (DELETE)
const deleteBannerData = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }

    // Delete images from the server
    banner.images.forEach((image) => {
      const imagePath = path.join(__dirname, 'uploadsBanner', image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error(`Error deleting file: ${imagePath}`);
      });
    });

    // Delete banner from the database
    await banner.remove();

    res.status(200).json({ message: 'Banner deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting banner.' });
  }
};

module.exports = {
  uploadBannerData,
  getAllBanners,
  getBannerById,
  updateBannerData,
  deleteBannerData,
};
