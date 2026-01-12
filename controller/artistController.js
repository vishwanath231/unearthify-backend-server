const Artist = require("../model/Artist");
const fs = require('fs');
const path = require('path');

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
    
    // Construct main image URL
    const image = req.files && req.files.image ? `/api/uploadArtistImage/${req.files.image[0].filename}` : null;
    
    if (!image) {
        return res.status(400).json({ message: "Artist main image is required" });
    }

    // Construct collection image URLs
    const collection = req.files && req.files.collection 
      ? req.files.collection.map(file => `/api/uploadArtistImage/${file.filename}`)
      : [];

    const newArtist = new Artist({
      name,
      artForm,
      city,
      state,
      country,
      bio,
      image,
      collection,
    });

    await newArtist.save();

    res.status(201).json({
      message: "Artist created successfully",
      data: newArtist,
    });
  } catch (error) {
    // If validation fails, we might want to delete the uploaded file to save space, 
    // but for now keeping it simple.
    res.status(500).json({ message: "Error creating artist", error: error.message });
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
    if (req.files && req.files.image) {
      artist.image = `/api/uploadArtistImage/${req.files.image[0].filename}`;
    }

    // Handle Collection Images Update (Append or Replace)
    if (req.files && req.files.collection) {
      const newCollectionImages = req.files.collection.map(file => `/api/uploadArtistImage/${file.filename}`);
      // For now, we'll append to the collection. In a real app, you might want more control.
      artist.collection = [...artist.collection, ...newCollectionImages];
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
    const artist = await Artist.findByIdAndDelete(id);

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    
    // Optional: Delete image file from filesystem
    // const imagePath = path.join(__dirname, '..', 'uploadArtistImage', path.basename(artist.image));
    // if(fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    res.json({ message: "Artist deleted successfully" });
  } catch (error) {
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
