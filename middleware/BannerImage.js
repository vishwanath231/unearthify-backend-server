const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the directory exists
const dir = path.join(__dirname, "..", "uploadsBanner");
fs.promises.mkdir(dir, { recursive: true }).catch((err) => {
  console.error("Error creating uploads directory:", err);
});

// Configure Multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
}).single("image"); // For a single file


module.exports = upload;





















