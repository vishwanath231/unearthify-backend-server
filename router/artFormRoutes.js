const express = require("express");
const router = express.Router();
const {
  getAllArtForms,
  getArtFormsByCategory,
  getArtFormById,
  getArtFormByTitle,
  createArtForm,
  updateArtFormById,
  deleteArtFormById,
} = require("../controller/artformController");
const { protectRoute, restrictTo } = require("../middleware/authMiddleware");
const { uploadArtFormImage } = require("../middleware/uploadMiddleware");

// Public routes
router.get("/artforms", getAllArtForms);
router.get("/artforms/category/:category", getArtFormsByCategory);
router.get("/artforms/:id", getArtFormById);
router.get("/artforms/title/:title", getArtFormByTitle);

// Admin routes (protected)
router.post(
  "/artforms",
  protectRoute,
  restrictTo("admin"),
  uploadArtFormImage.single("image"),
  createArtForm
);

router.put(
  "/artforms/:id",
  protectRoute,
  restrictTo("admin"),
  uploadArtFormImage.single("image"),
  updateArtFormById
);

router.delete(
  "/artforms/:id",
  protectRoute,
  restrictTo("admin"),
  deleteArtFormById
);

module.exports = router;
