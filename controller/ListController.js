const express = require("express");
const multer = require("multer");
const formFamilyMem = require("../model/familymember");

const fs = require("fs");


// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Express Router
const router = express.Router();

// POST Endpoint: Add a Family Member
const familyFormMemPost = async (req, res) => {
  try {
    const {
      name,
      dob,
      gender,
      maritalStatus,
      education,
      employmentStatus,
      contactEmail,
      contactPhone,
      occupation,
    } = req.body;

    const image = req.file ? req.file.path : null;

    const newMember = new formFamilyMem({
      name,
      dob,
      gender,
      maritalStatus,
      education,
      employmentStatus,
      contactEmail,
      contactPhone,
      occupation,
      image,
    });

    await newMember.save();
    res.status(201).json({ data: newMember });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET Endpoint: Get All Family Members
const familyMemGet = async (req, res) => {
  try {
    const members = await formFamilyMem.find();
    res.json({ data: members });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT Endpoint: Update a Family Member
const familyMemUpdate =async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      dob,
      gender,
      maritalStatus,
      education,
      employmentStatus,
      contactEmail,
      contactPhone,
      occupation,
    } = req.body;

    const updateData = {
      name,
      dob,
      gender,
      maritalStatus,
      education,
      employmentStatus,
      contactEmail,
      contactPhone,
      occupation,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedMember = await formFamilyMem.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({ data: updatedMember });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE Endpoint: Delete a Family Member
const familyMemDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await formFamilyMem.findByIdAndDelete(id);

    if (member && member.image) {
      fs.unlinkSync(member.image);
    }

    res.json({ message: "Family member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { familyFormMemPost, familyMemGet, familyMemUpdate, familyMemDelete, upload };
