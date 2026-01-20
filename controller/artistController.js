const Artist = require("../model/Artist");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../middleware/cloudinaryUpload");
const mongoose = require("mongoose");

// Get all artists
const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find().sort({ createdAt: -1 });
    res.json({ data: artists });
  } catch (error) {
    res.status(500).json({ message: "Error fetching artists", error: error.message });
  }
};

// Get featured artists
const getFeaturedArtists = async (req, res) => {
  try {
    const artists = await Artist.find({ isFeatured: true }).sort({ createdAt: -1 });
    res.json({ data: artists });
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured artists", error: error.message });
  }
};

// Get artist by ID
const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.json({ data: artist });
  } catch (error) {
    res.status(500).json({ message: "Error fetching artist", error: error.message });
  }
};

// Create new artist
const createArtist = async (req, res) => {
  try {
    const { name, artForm, city, state, country, bio } = req.body;

    if (!req.files?.image?.[0]) {
      return res.status(400).json({ message: "Artist main image is required" });
    }

    // upload main image
    const mainImg = await uploadToCloudinary(req.files.image[0].buffer, "artists");

    // upload collection
    let collection = [];
    if (req.files?.collection?.length) {
      collection = await Promise.all(
        req.files.collection.map(async (file) => {
          const res = await uploadToCloudinary(file.buffer, "artists_collection");
          return { url: res.secure_url, imageId: res.public_id };
        })
      );
    }

    const newArtist = new Artist({
      name,
      artForm,
      city,
      state,
      country,
      bio,
      image: mainImg.secure_url,
      imageId: mainImg.public_id,
      collection
    });

    await newArtist.save();

    res.status(201).json({ message: "Artist created", data: newArtist });

  } catch (error) {
    console.error("CREATE ARTIST ERROR:", error);
    res.status(500).json({ 
      message: "Error creating artist", 
      error: error.message 
    });
  }
};

// Update artist by ID
const updateArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, artForm, city, state, country, bio, status, isFeatured } = req.body;

    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    // Update fields if provided
    if (name) artist.name = name;
    if (artForm) artist.artForm = artForm;
    if (city) artist.city = city;
    if (state) artist.state = state;
    if (country) artist.country = country;
    if (bio) artist.bio = bio;
    if (status) artist.status = status;
    if (isFeatured !== undefined) artist.isFeatured = isFeatured;

    // Handle Main Image Update
    if (req.files?.image?.[0]) {

      if (artist.imageId) {
        await cloudinary.uploader.destroy(artist.imageId);
      }

      const imgRes = await uploadToCloudinary(req.files.image[0].buffer, "artists");

      artist.image = imgRes.secure_url;
      artist.imageId = imgRes.public_id;
    }

    // Handle Collection Images Update (Append or Replace)
    if (req.files?.collection?.length) {
      const uploaded = await Promise.all(
        req.files.collection.map(async (file) => {
          const res = await uploadToCloudinary(file.buffer, "artists_collection");
          return { url: res.secure_url, imageId: res.public_id };
        })
      );

      artist.collection.push(...uploaded);
    }

    await artist.save();

    res.json({
      message: "Artist updated successfully",
      data: artist,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating artist", error: error.message });
  }
};

// Delete artist by ID
const deleteArtistById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid artist id" });
    }

    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    if (artist.imageId) {
      try {
        await cloudinary.uploader.destroy(artist.imageId);
      } catch (err) {
        console.error("Cloudinary main image delete failed:", err.message);
      }
    }

    if (Array.isArray(artist.collection)) {
      for (const img of artist.collection) {
        if (img.imageId) {
          try {
            await cloudinary.uploader.destroy(img.imageId);
          } catch (err) {
            console.error("Cloudinary collection delete failed:", err.message);
          }
        }
      }
    }

    await Artist.findByIdAndDelete(id);
    res.json({ message: "Artist deleted successfully" });
  } catch (error) {
    console.error("DELETE ARTIST ERROR:", error);
    res.status(500).json({ message: "Error deleting artist", error: error.message });
  }
};

// Toggle featured status
const toggleFeaturedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findById(id);
    
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    artist.isFeatured = !artist.isFeatured;
    await artist.save();

    res.json({ 
      message: `Artist ${artist.isFeatured ? "featured" : "unfeatured"} successfully`, 
      data: artist 
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling featured status", error: error.message });
  }
};

module.exports = {
  getAllArtists,
  getFeaturedArtists,
  getArtistById,
  createArtist,
  updateArtistById,
  deleteArtistById,
  toggleFeaturedStatus,
};
