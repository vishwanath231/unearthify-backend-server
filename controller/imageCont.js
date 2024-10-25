const Image = require("../model/image");
const path = require("path");

// Upload Image
exports.uploadImage = (req, res) => {
  const profileImage = req.file.filename;

  const newImage = new Image({
    profileImage,
  });

  newImage
    .save()
    .then(() =>
      res.status(201).json({ message: "Image uploaded successfully!" })
    )
    .catch((err) =>
      res.status(500).json({ message: "Error uploading image", error: err })
    );
};

// Get Image
exports.getImage = (req, res) => {
  Image.findById(req.params.id)
    .then((image) => {
      if (!image) return res.status(404).json({ message: "Image not found" });
      res.status(200).json(image);
    })
    .catch((err) =>
      res.status(500).json({ message: "Error fetching image", error: err })
    );
};

// Delete Image
exports.deleteImage = (req, res) => {
  Image.findByIdAndDelete(req.params.id)
    .then((image) => {
      if (!image) return res.status(404).json({ message: "Image not found" });
      res.status(200).json({ message: "Image deleted successfully!" });
    })
    .catch((err) =>
      res.status(500).json({ message: "Error deleting image", error: err })
    );
};
