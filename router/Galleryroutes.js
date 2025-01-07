const express = require('express');
const router = express.Router();
const galleryController = require('../controller/GalleryController');
const upload= require("../middleware/galleryUploads")
// POST route to create a new gallery image
router.post('/gallery',upload.single("image"),galleryController.createGallery);

// GET route to get all gallery images
router.get('/gallery', galleryController.getGallerys);

// GET route to get gallery images by category
router.get('/gallery/category/:category', galleryController.getGallerysByCategory);

// GET route to get a gallery image by ID
router.get('/gallery/:id', galleryController.getGalleryById);

// PUT route to update a gallery image by ID
router.put('/gallery/:id', upload.single("image"),galleryController.updateGalleryById);

// DELETE route to delete a gallery image by ID
router.delete('/gallery/:id', galleryController.deleteGalleryById);

module.exports = router;
