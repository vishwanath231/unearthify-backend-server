const Banner = require('../model/adminBanner'); // Import Banner model
const { v4: uuidv4 } = require("uuid");

const uploadBannerData = async (req, res) => {
  try {
    const contentDetails = JSON.parse(req.body.data);

    // Ensure that a file has been uploaded
    const imageUrl = req.files && req.files.length > 0 ? `/uploadsBanner/${req.files[0].filename}` : null;

    const items = contentDetails.map((item, index) => {
      return {
        itemId: uuidv4(),
        titles: item.titles,
        descriptions: item.descriptions,
        image: imageUrl, // Ensure imageUrl is assigned correctly
      };
    });

    const newBanner = new Banner({ items });
    await newBanner.save();

    res.status(201).json({
      message: "Banner uploaded successfully",
      data: newBanner,
    });
  } catch (error) {
    console.error("Error uploading banner:", error);
    res.status(500).json({ error: "Error uploading banner", details: error.message });
  }
};





// Get all banners
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({ data: banners });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching banners', details: error.message });
  }
};

// Get a banner by ID
const getBannerById = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.status(200).json({ data: banner });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching banner by ID', details: error.message });
  }
};


const updateBannerData = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const { titles, descriptions, existingImage } = req.body;

    let imagePath = existingImage; // Default to existing image if no new image is uploaded

    // If a new file is uploaded, use its path
    if (req.file) {
      imagePath = `/uploadsBanner/${req.file.filename}`;
    }

    // Construct the dynamic update query
    const updateQuery = {
      ...(titles && { "items.$.titles": titles }),
      ...(descriptions && { "items.$.descriptions": descriptions }),
      ...(imagePath && { "items.$.image": imagePath }), // Update image if present
    };

    // Perform the update in the database
    const updatedBanner = await Banner.findOneAndUpdate(
      { _id: id, "items.itemId": itemId }, // Match banner ID and item ID
      { $set: updateQuery }, // Apply updates dynamically
      { new: true } // Return the updated document
    );

    // Handle the case where the item is not found
    if (!updatedBanner) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item updated successfully",
      data: updatedBanner,
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
};




























// const deleteBannerData = async (req, res) => {
//   try {
//     const { bannerId } = req.params;  // Extract bannerId from the URL parameter
//     const { itemId } = req.body;      // Extract itemId from the request body
//     console.log("Banner ID:", bannerId, "Item ID:", itemId);


//     if (!banner) {
//       return res.status(404).json({ message: "Banner not found" });
//     }

//     return res.status(200).json({
//       message: "Banner deleted successfully!",
//     });
//     // Validate if itemId is in UUID format (assuming UUID for itemId)
//     if (!itemId || !validateUUID(itemId)) {
//       return res.status(400).json({ message: "Invalid itemId" });
//     }

//     // Find the Banner and remove the item from the items array
//     const banner = await Banner.findById(bannerId);
//     if (!banner) {
//       return res.status(404).json({ message: "Banner not found" });
//     }

//     const itemIndex = banner.items.findIndex(item => item.itemId === itemId);
//     if (itemIndex === -1) {
//       return res.status(404).json({ message: "Item not found in the Banner" });
//     }

//     // Remove the item from the items array
//     banner.items.pull(banner.items[itemIndex]._id);
//     await banner.save();

//     res.status(200).json({
//       message: "Item deleted successfully from the Banner!",
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(400).json({ error: err.message });
//   }
// };

// // Helper function to validate UUID (itemId)
// function validateUUID(uuid) {
//   const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
//   return regex.test(uuid);
// }





module.exports = {
  uploadBannerData,
  getAllBanners,
  getBannerById,
  // bannerGetById,
  updateBannerData,
  // deleteBannerData,
};
