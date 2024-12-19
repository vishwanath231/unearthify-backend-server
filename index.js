// Required dependencies
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const path = require("path");

// Load environment variables from .env file
dotenv.config();

// Import the database connection and routers
const database = require("./database/database");
const router = require("./router/routes");
const routerFam = require("./router/family");

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port or default to 4000

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize database connection
database();

// Set up CORS to allow requests from the frontend domain (using .env variable)
app.use(cors({ origin: process.env.Host }));

// Define the routes
app.use("/api", router);      // Main API routes
app.use("/api/family", routerFam);  // Family-related API routes

// Serve static files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server and log that it's running
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
