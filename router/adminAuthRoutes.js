const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminProfile,
  updateAdminById,
  deleteAdminById,
  changePassword,
} = require("../controller/adminController");
const { protectRoute, restrictTo } = require("../middleware/authMiddleware");

// Public routes
router.post("/admin/register", registerAdmin); // In production, protect this route
router.post("/admin/login", loginAdmin);

// Protected routes
router.get("/admin/profile", protectRoute, getAdminProfile);
router.put("/admin/change-password", protectRoute, changePassword);

// Super Admin routes
router.get(
  "/admin/all",
  protectRoute,
  restrictTo("superadmin"),
  getAllAdmins
);

router.put(
  "/admin/:id",
  protectRoute,
  restrictTo("superadmin"),
  updateAdminById
);

router.delete(
  "/admin/:id",
  protectRoute,
  restrictTo("superadmin"),
  deleteAdminById
);

module.exports = router;
