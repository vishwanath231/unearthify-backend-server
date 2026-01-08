const express = require("express");
const router = express.Router();
const artformController = require("../../controller/admin/artistformConnect");
const upload = require("../../middleware/artformUploads");

router.post("/artist", upload.single("image"), artformController.createArtistForm);
router.get("/artforms", artformController.getArtForms);
router.put("/artforms/:id", upload.single("image"), artformController.updateArtForm);
router.delete("/artforms/:id", artformController.deleteArtForm);

module.exports = router;
