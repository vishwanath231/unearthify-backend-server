const express = require('express');
const imageController = require('../controller/GalleryController');
const upload = require('../middleware/galleryUploads');  // Import the upload middleware

const router = express.Router();

// Route to create a new image (upload image)
router.post('/images', upload.single('image'), imageController.createGallery);

// Route to get all images
router.get('/images', imageController.getGallerys);

// Route to get images by category
router.get('/images/category/:category', imageController.getImagesByCategory);

// Route to update an image
router.put('/images/:id', upload.single('image'), imageController.updateImage);  // If updating an image, we can upload a new one

// Route to delete an image
router.delete('/images/:id', imageController.deleteImage);

module.exports = router;
