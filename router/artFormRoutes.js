const express = require("express");
const router = express.Router();
const { uploadArtFormImage } = require("../middleware/uploadMiddleware");
const { protectRoute, restrictTo } = require("../middleware/authMiddleware");

// Import New Controllers
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory
} = require("../controller/artform/artCategoryController");

const {
  createArtDetail,
  getAllArtDetails,
  getArtDetailById,
  updateArtDetail,
  deleteArtDetail
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
  protectRoute,
  restrictTo("admin"), // Uncomment protecting later if needed, user didn't specify authentication reqs but usually yes.
  uploadArtFormImage.fields([
    { name: "categoryImage", maxCount: 1 },
    { name: "image", maxCount: 20 }
  ]), // "image" matches the Postman key (can handle multiple files with same key)
  createCategory
);

router.delete(
  "/categories/:id",
  protectRoute,
  restrictTo("admin"),
  deleteCategory
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
  protectRoute,
  restrictTo("admin"),
  uploadArtFormImage.none(), // Required to parse multipart/form-data when no files are uploaded
  createArtDetail
);

router.put(
  "/details/:id",
  protectRoute,
  restrictTo("admin"),
  uploadArtFormImage.none(),
  updateArtDetail
);

router.delete(
  "/details/:id",
  protectRoute,
  restrictTo("admin"),
  deleteArtDetail
);

module.exports = router;
