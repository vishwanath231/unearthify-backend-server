const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getUpcomingEvents,
  getEventById,
  createEvent,
  updateEventById,
  deleteEventById,
} = require("../controller/eventController");
const { protectRoute, restrictTo } = require("../middleware/authMiddleware");
const { uploadEventImage } = require("../middleware/uploadMiddleware");

// Public routes
router.get("/events", getAllEvents);
router.get("/events/upcoming", getUpcomingEvents);
router.get("/events/:id", getEventById);

// Admin routes (protected)
router.post(
  "/admin/events",
  protectRoute,
  restrictTo("admin", "superadmin"),
  uploadEventImage.single("image"),
  createEvent
);

router.put(
  "/admin/events/:id",
  protectRoute,
  restrictTo("admin", "superadmin"),
  uploadEventImage.single("image"),
  updateEventById
);

router.delete(
  "/admin/events/:id",
  protectRoute,
  restrictTo("admin", "superadmin"),
  deleteEventById
);

module.exports = router;
