const express = require('express');
const router = express.Router();
const galleryController = require('../controller/GalleryController');
const { protectRoute, restrictTo } = require("../middleware/authMiddleware");
const { uploadGalleryImage } = require("../middleware/uploadMiddleware");

/**
 * Public Routes
 */

// GET all gallery images
router.get('/gallery', galleryController.getGallerys);

// GET gallery images by category
router.get('/gallery/category/:category', galleryController.getGallerysByCategory);

// GET a gallery image by ID
router.get('/gallery/:id', galleryController.getGalleryById);

/**
 * Admin Routes (Protected)
 */

// POST create a new gallery image
router.post(
  '/gallery',
  protectRoute,
  restrictTo("admin"),
  uploadGalleryImage.single("image"),
  galleryController.createGallery
);

// PUT update a gallery image by ID
router.put(
  '/gallery/:id',
  protectRoute,
  restrictTo("admin"),
  uploadGalleryImage.single("image"),
  galleryController.updateGalleryById
);

// DELETE a gallery image by ID
router.delete(
  '/gallery/:id',
  protectRoute,
  restrictTo("admin"),
  galleryController.deleteGalleryById
);

module.exports = router;
