const Registration = require("../model/registration");
const nodemailer = require("nodemailer");
// const User = require("./models/User");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register
const regPost = async (req, res) => {
  try {
    const { FirstName, LastName, UserName, Email, Password } = req.body;
    console.log("password", Password);

    const hashPassword = await bcrypt.hash(Password, 10);

    const register = new Registration({
      FirstName,
      LastName,
      UserName,
      Email,
      Password: hashPassword,
    });

    await register.save();

    res.json({
      data: register,
    });
  } catch (error) {
    res.status(500).json({
      Error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    console.log("password", Password);
    console.log("password login::", Password);
    const dataUser = await Registration.findOne({ Email });

    if (!dataUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(Password, dataUser.Password);
    console.log("valid password", validPassword);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: dataUser._id, // Include user ID for retrieval
        FirstName: dataUser.FirstName,
        LastName: dataUser.LastName,
        UserName: dataUser.UserName,
        Email: dataUser.Email,
        // Password: dataUser.Password,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Set token expiration to 24 hours
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

const getUserData = async (req, res) => {
  try {
    console.log("user data");

    const userId = req.user.id; // Ensure this is correct
    console.log("User ID from token:", userId); // Debugging log

    const userData = await Registration.findById(userId).select("-Password"); // Exclude Password
    console.log("user data", userData);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user data
    res.json({
      FirstName: userData.FirstName,
      LastName: userData.LastName,
      UserName: userData.UserName,
      Email: userData.Email,
    });
  } catch (error) {
    console.error("Error retrieving user data:", error.message); // Debugging log
    res.status(500).json({ Error: error.message });
  }
};

const Forgot = async (req, res) => {
  const { Email } = req.body;
  console.log("aaaa", Email);

  try {
    const user = await Registration.findOne({ Email });
    if (!user) return res.status(404).send("User not found");

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();
    console.log("token", token);

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "serviceuse66@gmail.com",
        pass: "lpww malh pupq jafg",
      },
      tls: { ciphers: "SSLv3" },
    });
    console.log("wertyuiojhgfd");

    const mailOptions = {
      from: "serviceuse66@gmail.com",
      to: Email,
      subject: "Password Reset",
      text: "Here is the link to reset your password",
      html: `<p>You requested a password reset</p>
      <p>Click <a href="http://localhost:5174/reset-password/${token}">here</a> to reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.send("Reset link sent to your email.");
  } catch (error) {
    console.log("asdfghjkl");

    console.error(error);
    res.status(500).send("Server error");
  }
};

const Reset = async (req, res) => {
  const { password } = req.body; // Ensure we're receiving the new password
  const { token } = req.params;

  try {
    // Find the user with the matching token and check if the token has not expired
    const user = await Registration.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }, // token must not be expired
    });

    if (!user) return res.status(400).send("Invalid or expired token");

    // Hash the new password and save it
    user.Password = await bcrypt.hash(password, 10);
    user.resetToken = undefined; // clear the reset token
    user.resetTokenExpiration = undefined; // clear token expiration
    await user.save();

    res.send("Password has been reset successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = { regPost, login, getUserData, Reset, Forgot };
