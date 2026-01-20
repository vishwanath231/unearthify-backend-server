const express = require("express");
const router = express.Router();

const {
  getAllArtists,
  getFeaturedArtists,
  getArtistById,
  createArtist,
  updateArtistById,
  deleteArtistById,
  toggleFeaturedStatus,
} = require("../controller/artistController");

const { protectRoute, restrictTo } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/**
 * Public Routes
 */

// Get all artists
router.get("/artists", getAllArtists);

// Get featured artists
router.get("/artists/featured", getFeaturedArtists);

// Get artist by ID
router.get("/artists/:id", getArtistById);

/**
 * Admin Routes (Protected)
 */

// Create artist
router.post(
  "/artists",
  protectRoute,
  restrictTo("admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "collection", maxCount: 10 },
  ]),
  createArtist
);

// Update artist
router.put(
  "/artists/:id",
  protectRoute,
  restrictTo("admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "collection", maxCount: 10 },
  ]),
  updateArtistById
);

// Delete artist
router.delete("/artists/:id",protectRoute,restrictTo("admin"),deleteArtistById);

// Toggle featured status
router.patch("/artists/:id/toggle-featured",protectRoute,restrictTo("admin"),toggleFeaturedStatus);

module.exports = router;
