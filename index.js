// Required dependencies
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const path = require("path");

// Load environment variables from .env file
dotenv.config();

// Import the database connection
const database = require("./database/database");

// Import existing routers
const router = require("./router/registerRoutes");
const routerFam = require("./router/family");
const admin = require("./router/adminroutes");
// const adminStay = require("./router/adminStayroute");
const Gallery = require("./router/Galleryroutes");

// Import new routers for the main application
// const artistRoutes = require("./router/artistRoutes");
// const eventRoutes = require("./router/eventRoutes");
// const artFormRoutes = require("./router/artFormRoutes");
// const adminAuthRoutes = require("./router/adminAuthRoutes");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
database();

// Set up CORS to allow requests from the frontend domain
app.use(cors({
  origin: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Unearthify API Server is running",
    version: "1.0.0",
  });
});

// Define the routes - New API routes
// app.use("/api", artistRoutes);      // Artist routes
// app.use("/api", eventRoutes);       // Event routes
// app.use("/api", artFormRoutes);     // Art Form routes
// app.use("/api", adminAuthRoutes);   // Admin authentication routes

// Existing routes
app.use("/api", router);            // Main API routes
app.use("/api", routerFam);         // Family-related API routes
app.use("/api", admin);             // Admin routes
// app.use("/api", adminStay);         // Admin stay routes
app.use("/api", Gallery);           // Gallery routes

// Static file serving for uploads
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/uploadsBanner", express.static(path.join(__dirname, "uploadsBanner")));
app.use("/api/images", express.static(path.join(__dirname, "uploadsGallery")));
app.use("/api/uploadArtistImage", express.static(path.join(__dirname, "uploadArtistImage")));
app.use("/api/uploadsArtForms", express.static(path.join(__dirname, "uploadsArtForms")));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start the server and log that it's running
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(` Base URL: http://localhost:${process.env.PORT}/api`);
});
