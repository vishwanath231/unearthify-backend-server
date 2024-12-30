const multer = require("multer");
const path = require("path");

// Set up storage engine for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadsBanner/"); // Store images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) { // Correct prefix
    cb(null, true); // Accept image file
  } else {
    cb(new Error("Only image files are allowed"), false); // Reject non-image files
  }
};


// Initialize multer with storage and filter
const upload = multer({ storage, fileFilter });

module.exports = upload;
