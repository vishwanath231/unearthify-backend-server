const express = require('express');
const router = express.Router();
const upload= require('../middleware/BannerImage');  
const controller = require('../controller/adminupdates'); 

// Route for uploading banner data
router.post("/uploadBanner", upload.single("file"),controller.uploadBannerData);

// Route to get all banners
router.get('/banners',controller.getAllBanners);

// // Route to get a banner by ID
// router.get('/banner/:id',controller.getBannerById);

// // Route for updating banner data by ID
// router.put('/updateBanner/:id', uploadMiddleware,controller.updateBannerData);

// // Route for deleting banner data by ID
// router.delete('/deleteBanner/:id',controller.deleteBannerData);

module.exports = router;
