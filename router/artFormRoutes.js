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
} = require("../controller/artFormController");
const { protectRoute, restrictTo } = require("../middleware/authMiddleware");
const { uploadArtFormImage } = require("../middleware/uploadMiddleware");

// Public routes
router.get("/artforms", getAllArtForms);
router.get("/artforms/category/:category", getArtFormsByCategory);
router.get("/artforms/:id", getArtFormById);
router.get("/artforms/title/:title", getArtFormByTitle);

// Admin routes (protected)
router.post(
  "/admin/artforms",
  protectRoute,
  restrictTo("admin", "superadmin"),
  uploadArtFormImage.single("image"),
  createArtForm
);

router.put(
  "/admin/artforms/:id",
  protectRoute,
  restrictTo("admin", "superadmin"),
  uploadArtFormImage.single("image"),
  updateArtFormById
);

router.delete(
  "/admin/artforms/:id",
  protectRoute,
  restrictTo("admin", "superadmin"),
  deleteArtFormById
);

module.exports = router;
