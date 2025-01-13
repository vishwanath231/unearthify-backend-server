const express = require('express');
const router = express.Router();
const upload = require('../middleware/BannerImage'); // Import multer middleware
const controller = require('../controller/adminupdates'); // Import controller functions



// router.post("/uploadBanner", upload, controller.uploadBannerData);




// Route to get all banners
router.get('/banners', controller.getAllBanners);

// Route to get a specific banner by ID
router.get('/banner/:id', controller.getBannerById);


// Route for updating a specific item within a banner
router.put('/updateBanner/:id/item/:itemId', upload, controller.updateBannerData);


module.exports = router;
