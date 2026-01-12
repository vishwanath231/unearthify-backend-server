const Banner = require("../model/adminBanner");

// Get all banners
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json({ data: banners });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Get a specific banner by ID
const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json({ data: banner });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Update a specific item within a banner
const updateBannerData = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const { titles, descriptions } = req.body;
    const image = req.file ? `/api/bannerImage/${req.file.filename}` : null;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const itemIndex = banner.items.findIndex((item) => item.itemId === itemId || item._id.toString() === itemId);

    if (itemIndex === -1) {
        // Try searching by _id if itemId is not found or vice versa
         const itemIndexById = banner.items.findIndex(item => item._id.toString() === itemId);
         if(itemIndexById === -1)
            return res.status(404).json({ message: "Banner item not found" });
    }
    
    // Use the found index
    const targetIndex = banner.items.findIndex((item) => item.itemId === itemId || item._id.toString() === itemId);

    if (titles) banner.items[targetIndex].titles = titles;
    if (descriptions) banner.items[targetIndex].descriptions = descriptions;
    if (image) banner.items[targetIndex].image = image;

    await banner.save();

    res.json({ message: "Banner item updated successfully", data: banner });
  } catch (error) {
    console.error("Update Banner Error:", error);
    res.status(500).json({ Error: error.message });
  }
};

module.exports = {
  getAllBanners,
  getBannerById,
  updateBannerData,
};
