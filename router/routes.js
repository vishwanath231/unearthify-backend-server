// router.js
const express = require("express");
const controller = require("../controller/controller");

const router = express.Router();
const verifyToken = require("../middleware/jwt");
router.post("/register", controller.regPost);
router.post("/login", controller.login);
// router.put("/user/update", controller.updateUserName);
router.get("/user", verifyToken, controller.getUserData);
router.get("/userData", controller.getUser);
router.post("/get",controller.getUserInfo)
router.post("/forgotPassword", controller.Forgot);
router.post("/resetPassword/:token", controller.Reset);
router.put("/familyNameUpdate",controller.familyName)
router.get("/pending", controller.getPendingRegistrations);

// PUT: Approve a user by ID
router.put("/approve/:id", controller.approveRegistration);
router.put("/reject/:id",controller.rejectRegistration)


router.get("/approveData",controller.getApprovedUsers)
router.get("/rejectData",controller.rejectGetAll)
 
module.exports = router;
