// router.js
const express = require("express");
const controller = require("../controller/registrationForm");
const router = express.Router();
const verifyToken = require("../middleware/jwt");

router.post("/register", controller.registerPost);
router.post("/login", controller.login);
// User Management
router.get("/user", verifyToken, controller.getUserData); // Get current logged in user
router.get("/userData", controller.getUser); // Get all users
// router.post("/get", controller.getUserInfo); // Get specific user by ID (body)
// router.put("/user/update", controller.updateUser); // Update user profile
// router.delete("/user/delete/:id", controller.deleteUser); // Delete user

router.post("/forgotPassword", controller.Forgot);
router.post("/resetPassword/:token", controller.Reset);

// router.get("/pending", controller.getPendingRegistrations);

// // PUT: Approve a user by ID
// router.put("/approve/:id", controller.approveRegistration);
// router.put("/reject/:id", controller.rejectRegistration);


// router.get("/approveData", controller.getApprovedUsers);
// router.get("/rejectData", controller.rejectGetAll);
 
// // homeContactForm
// router.post("/sentMail", controller.homeContactForm);
module.exports = router;
