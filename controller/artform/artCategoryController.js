const ArtCategory = require("../../model/ArtCategory");

// Create a new Art Category with Art Types
// const createCategory = async (req, res) => {
//   try {
//     const { categoryName, categoryDescription } = req.body;
//     let { artTypes } = req.body;

//     // Parse artTypes if it's sent as a string (common in FormData)
//     if (typeof artTypes === 'string') {
//         try {
//             artTypes = JSON.parse(artTypes);
//         } catch (e) {
//             // If legitimate JSON parse fails, assume it might be a simple string (single art type name)
//             // This allows Postman users to just type "Painting" instead of full JSON
//             console.log("artTypes is not valid JSON, treating as single type Name:", artTypes);
//             artTypes = [{ name: artTypes, description: "" }];
//         }
//     }

//     if (!req.files?.image || req.files.image.length === 0) {
//       return res.status(400).json({ message: "Art type images required" });
//     }

//     if (!artTypes || !Array.isArray(artTypes)) {
//        // Final fallback if it parsed to something else (e.g. number/boolean which is rare in formData but possible)
//        if (typeof artTypes === 'object' && artTypes !== null) {
//           // It was already an object (maybe body parser handled it?), wrap in array if not array
//           artTypes = [artTypes];
//        } else {
//            return res.status(400).json({ success: false, message: "artTypes is required and must be an array (or a valid string name)." });
//        }
//     }

//     // Check if files are uploaded
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ success: false, message: "Art type images are required." });
//     }

//     // Verify mapping: 1 file per art type
//     if (req.files.length !== artTypes.length) {
//         return res.status(400).json({ success: false, message: "Number of images must match number of art types." });
//     }

//     // Map images to art types
//     const processedArtTypes = artTypes.map((type, index) => {
//         return {
//             name: type.name || type.artTypeName, // fallback for field naming
//             description: type.description || type.artTypeDescription,
//             image: `/api/artFormImage/${req.files[index].filename}`
//         };
//     });

//     const newCategory = new ArtCategory({
//       name: categoryName,
//       description: categoryDescription,
//       artTypes: processedArtTypes,
//     });

//     await newCategory.save();

//     res.status(201).json({
//       success: true,
//       message: "Category and Art Types created successfully",
//       data: newCategory,
//     });
//   } catch (error) {
//     console.error("Error creating category:", error);
//     res.status(500).json({ success: false, message: "Error creating category", error: error.message });
//   }
// };

    const createCategory = async (req, res) => {
  try {
    const { categoryName, categoryDescription } = req.body;
    let { artTypes } = req.body;

    console.log("BODY:", req.body);
console.log("FILES:", req.files);

    if (typeof artTypes === "string") {
      artTypes = JSON.parse(artTypes);
    }

    if (!req.files?.image || req.files.image.length === 0) {
      return res.status(400).json({ success: false, message: "Art type images are required." });
    }

    if (!req.files?.categoryImage || req.files.categoryImage.length === 0) {
    return res.status(400).json({ success: false, message: "Category image is required." });
    }

    if (req.files.image.length !== artTypes.length) {
      return res.status(400).json({ message: "Art types & images mismatch" });
    }

    const categoryImage = `/api/artFormImage/${req.files.categoryImage[0].filename}`;

    const processedArtTypes = artTypes.map((type, index) => ({
        name: type.name,
        description: type.description,
        image: `/api/artFormImage/${req.files.image[index].filename}`
    }));

    const newCategory = new ArtCategory({
        name: categoryName,
        description: categoryDescription,
        image: categoryImage,
        artTypes: processedArtTypes,
    });

    await newCategory.save();

    res.status(201).json({ success: true, data: newCategory });
  } catch (e) {
    res.status(500).json({ message: "Create failed", error: e.message });
}
}


// Get all categories (useful for the dropdown in Details page)
const getAllCategories = async (req, res) => {
    try {
        const categories = await ArtCategory.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching categories", error: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await ArtCategory.findById(req.params.id);
        if(!category) {
            return res.status(404).json({ success: false, message: "Category not found"});
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching category", error: error.message });
    }
}

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ArtCategory.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    await ArtCategory.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message
    });
  }
};


module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory
};
