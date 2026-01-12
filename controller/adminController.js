const Admin = require("../model/Admin");
const jwt = require("jsonwebtoken");

// Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email or username already exists" });
    }

    const newAdmin = new Admin({
      username,
      email,
      password,
      role: role || "admin",
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error: error.message });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || "familyConnect",
      { expiresIn: "24h" }
    );

    admin.lastLogin = Date.now();
    await admin.save();

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Get Admin Profile
const getAdminProfile = async (req, res) => {
  try {
    res.json({ success: true, admin: req.admin });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

// Get All Admins (Super Admin only)
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error: error.message });
  }
};

// Update Admin
const updateAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, status } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      id,
      { username, email, role, status },
      { new: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ message: "Error updating admin", error: error.message });
  }
};

// Delete Admin
const deleteAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin", error: error.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);

    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAllAdmins,
  updateAdminById,
  deleteAdminById,
  changePassword,
};
