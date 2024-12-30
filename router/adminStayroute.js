const express = require("express");
const router = express.Router();
const Controller = require("../controller/adminConnect");

router.post("/stayConnect", Controller.createEventConnect); // Create
router.get("/stayConnectGet",Controller.getEventConnects); // Read all
router.get("/stayConnect/:id", Controller.getEventConnectById); // Read one
router.put("/stayConnect/:id", Controller.updateEventConnect); // Update
router.delete("/stayConnect/:id",Controller.deleteEventConnect); // Delete

module.exports = router;
