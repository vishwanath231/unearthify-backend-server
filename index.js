const dotenv = require("dotenv");
const database = require("./database/database");
const router = require("./router/routes");
const routerFam = require("./router/family");
const express = require("express");
const cors = require("cors");  // Only import cors once
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000; // Use a different port to avoid conflict

// Middleware
app.use(express.json());
app.use(
  cors({ origin: "http://localhost:3000", methods: "GET,POST,PUT,DELETE" }) // This is correct
);

// Database connection
database();

// Routes
app.use("/api", router);
app.use("/api", routerFam);
// Serve static files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
