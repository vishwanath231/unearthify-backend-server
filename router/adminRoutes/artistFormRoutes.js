const express = require("express");
const router = express.Router();
const artformController = require("../../controller/admin/artistformConnect");
const upload = require("../../middleware/artistform");

router.post("/artistPost", upload.single("image"), artformController.createArtistForm);
router.get("/artistGet", artformController.getArtistForms);
router.put("/artistUpdate/:id", upload.single("image"), artformController.updateArtistForm);
router.delete("/artistDelete/:id", artformController.deleteArtistForm);

module.exports = router;
