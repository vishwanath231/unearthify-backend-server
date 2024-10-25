// router.js
const express = require("express");
const controller = require("../controller/controller");
const controllerTask = require("../controller/ListController");
const router = express.Router();
const verifyToken = require("../middleware/jwt");
// register/login api
router.post("/register", controller.regPost);
router.post("/login", controller.login);
// task api
router.post("/taskPost", controllerTask.todoList);
router.get("/getTaskData", controllerTask.taskData);

router.get("/getOne/:id", controllerTask.GetSingleData);
router.put("/getUpdate/:id", controllerTask.updateData);

router.delete("/delete/:id", controllerTask.deleteNote);
// password api
router.get("/user", verifyToken, controller.getUserData);

router.post("/forgotPassword", controller.Forgot);
router.post("/resetPassword/:token", controller.Reset);

const multer = require("multer");
const path = require("path");
const imageController = require("../controller/imageCont");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
});

// Routes
router.post(
  "/upload",
  upload.single("profileImage"),
  imageController.uploadImage
);

module.exports = router;
