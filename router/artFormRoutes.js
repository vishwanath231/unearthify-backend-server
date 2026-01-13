const express = require("express");
const router = express.Router();
const { uploadArtFormImage } = require("../middleware/uploadMiddleware");
const { protectRoute, restrictTo } = require("../middleware/authMiddleware");

// Import New Controllers
const {
  createCategory,
  getAllCategories,
  getCategoryById
} = require("../controller/artform/artCategoryController");

const {
  createArtDetail,
  getAllArtDetails,
  getArtDetailById
} = require("../controller/artform/artDetailController");


// ==========================================
// Category Routes
// ==========================================

// Public: Get all categories (Admin likely needs this too for lists, and User for viewing)
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);

// Admin: Create Category with Art Types
// Expects 'images' field for files
router.post(
  "/categories",
  // protectRoute,
  // restrictTo("admin"), // Uncomment protecting later if needed, user didn't specify authentication reqs but usually yes.
  uploadArtFormImage.array("images"), // "images" must match the formData field name
  createCategory
);


// ==========================================
// Art Details Routes
// ==========================================

// Public: Get all details
router.get("/details", getAllArtDetails);
router.get("/details/:id", getArtDetailById);

// Admin: Create Art Details
router.post(
  "/details",
  // protectRoute,
  // restrictTo("admin"),
  // upload.none(), // If there are no files, multer's .none() or just express.json() works. 
  // But wait, express.json() is global usually. 
  // If we don't have files here, standard body parsing applies.
  createArtDetail
);

module.exports = router;
