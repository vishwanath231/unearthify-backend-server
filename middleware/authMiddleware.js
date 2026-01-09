const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin");

// Protect routes - verify JWT token
const protectRoute = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login to access this resource.",
      });
    }
    
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "unearthify_secret_key_2026"
    );
    
    // Get admin from token
    const admin = await Admin.findById(decoded.id).select("-password");
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found. Token is invalid.",
      });
    }
    
    // Check if admin is active
    if (admin.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is not active. Please contact super admin.",
      });
    }
    
    // Attach admin to request
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Token verification failed.",
      error: error.message,
    });
  }
};

// Restrict to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };
};

module.exports = { protectRoute, restrictTo };
