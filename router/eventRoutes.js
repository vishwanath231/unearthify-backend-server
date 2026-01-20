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
const upload = require("../middleware/upload");

// Public routes
router.get("/events", getAllEvents);
router.get("/events/upcoming", getUpcomingEvents);
router.get("/events/:id", getEventById);

// Admin routes (protected)
router.post(
  "/events",
  protectRoute,
  restrictTo("admin"),
  upload.single("image"),
  createEvent
);

router.put(
  "/events/:id",
  protectRoute,
  restrictTo("admin"),
  upload.single("image"),
  updateEventById
);

router.delete(
  "/events/:id",
  protectRoute,
  restrictTo("admin"),
  deleteEventById
);

module.exports = router;
