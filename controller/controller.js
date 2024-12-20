const Registration = require("../model/registration");
const nodemailer = require("nodemailer");
// const User = require("./models/User");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "familyConnect";
// register
const regPost = async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      UserName,
      Email,
      Password,
      Pincode,
      Country,
      State,
      City,
    } = req.body;
    console.log("password", Password);
    console.log("Request body:", req.body);
    const hashPassword = await bcrypt.hash(Password, 10);

    const register = new Registration({
      FirstName,
      LastName,
      UserName,
      FamilyName: UserName,
      Email,
      Password: hashPassword,
      Pincode,
      Country,
      State,
      City,
    });

    await register.save();

    res.json({
      data: register,
    });
  } catch (error) {
    res.status(500).json({
      Error: error.message,
      
    });
    console.log(error,"reg error")
  }
};

const familyName = async (req, res) => {
  try {
    const { familyName } = req.body;
    const userId = req.user.id;

    const updateFamilyName= {familyName};
    const updateFamily= await formFamilyMem.findByIdAndUpdate(updateFamilyName,userId);
    res.json({
      data:updateFamily
    })
  } catch (error) {
    res.status(500).json({
      Error:error.message
    })
  }
};

const login = async (req, res) => {
  try {
    const { Email, Username, Password } = req.body;

    // Check if either Email or Username is provided
    if (!Email && !Username) {
      return res
        .status(400)
        .json({ message: "Either Email or Username is required." });
    }

    // Find the user by Email or Username
    const dataUser = await Registration.findOne({
      $or: [{ Email }, { UserName: Username }],
    });

    if (!dataUser) {
      return res.status(400).json({ message: "User not found." });
    }

    // Check if the user's status is 'approved'
    if (dataUser.status !== "approved") {
      return res.status(400).json({
        message:
          "Please wait for admin approval / Your are New User Register first",
      });
    }

    // Validate the password
    const validPassword = await bcrypt.compare(Password, dataUser.Password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // Generate JWT token if authentication is successful
    const token = jwt.sign(
      {
        id: dataUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    console.log(token,"token")

    // Return the generated token
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getUserInfo = async (req, res) => {
  try {
    // Extract email and username from the request body
    const { Email, UserName } = req.body;

    // Find the user in the database with both Email and UserName
    const user = await Registration.find({ Email, UserName });
    console.log(user, "miniiiiiiiiiii");
    // Check if the user exists
    if (user) {
      // If user is found, send success response
      return res.status(200).json({
        message: "User found successfully",
        user,
      });
    } else {
      // If user is not found, send an error response
      return res.status(404).json({
        message: "User not found. Please check the username and email.",
      });
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error fetching user:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getUserData = async (req, res) => {
  try {
    console.log("user data");

    const userId = req.user.id;
    console.log("User ID from token:", userId);

    const userData = await Registration.findById(userId).select("-Password"); // Exclude Password
    console.log("user data", userData);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      userId,
      FirstName: userData.FirstName,
      LastName: userData.LastName,
      UserName: userData.UserName,
      Email: userData.Email,
      Pincode: userData.Pincode,
      Country: userData.Country,
      State: userData.State,
      City: userData.City,
    });
  } catch (error) {
    console.error("Error retrieving user data:", error.message);
    res.status(500).json({ Error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    console.log("get user");

    const userData = await Registration.find(); // Exclude Password
    console.log("getData", userData);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user data
    res.json({
      data: userData,
    });
  } catch (error) {
    console.error("Error retrieving user data:", error.message); // Debugging log
    res.status(500).json({ Error: error.message });
  }
};

// Configure Nodemailer
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
// 1. Get all pending registrations
const getPendingRegistrations = async (req, res) => {
  console.log("sunbmytfghbui");
  try {
    const pendingUsers = await Registration.find({ status: "pending" });
    console.log("Pending users:", pendingUsers); // Log the fetched data

    // Respond with the pending users data
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending registrations:", error); // Log the error
    res
      .status(500)
      .json({ message: "Error fetching pending registrations", error });
  }
};

// 2. Approve a registration
const approveRegistration = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await Registration.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (updatedUser) {
      // Send approval email
     
      const mailOptions = {
        from: "serviceuse66@gmail.com", // Sender address
        to: updatedUser.Email, // Receiver email
        subject: "Registration Approved",
        text: "Dear User",
        html: `<p>Click to login <a href="${process.env.REACT_APP_API_BASE_URL}/login">login page</a> ${updatedUser.FirstName},\n\nYour family registration has been approved. Now you can log in to see your family account.\n\nThank you!</p>`,
      };
      
      await transporter.sendMail(mailOptions);

      res.status(200).json({
        message: "User approved successfully and email sent",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error approving user", error });
  }
};
// 2. Approve a registration

const getApprovedUsers = async (req, res) => {
  try {
    const approvedUsers = await Registration.find({ status: "approved" });
    res.json({ data: approvedUsers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching approved users", error });
  }
};

const rejectGetAll = async (req, res) => {
  try {
    const rejectedUsers = await Registration.find({ status: "rejected" });
    res.json({
      data: rejectedUsers, // Return all rejected users
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching rejected users", error });
  }
};
console.log(process.env.REACT_APP_API_BASE_URL,"host env")

// 3. Reject a registration
const rejectRegistration = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await Registration.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (updatedUser) {
      // Send rejection email
      const mailOptions = {
        from: "serviceuse66@gmail.com", // Sender address
        to: updatedUser.Email, // Receiver email
        subject: "Registration Rejected",
        text: `Dear ${updatedUser.FirstName},\n\nYour family registration has been rejected. Please contact technical support for further assistance.\n\nThank you!`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        message: "User rejected successfully and email sent",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error rejecting user", error });
  }
};

// 4. Check user status on login
const checkUserStatus = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Registration.findOne({ Email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.status === "approved") {
      res.status(200).json({ message: "User is approved, redirecting..." });
    } else if (user.status === "pending") {
      res.status(403).json({ message: "User is still pending approval" });
    } else if (user.status === "rejected") {
      res.status(403).json({
        message: "Your registration was rejected. Contact support for details.",
      });
    } else {
      res.status(400).json({ message: "Unknown user status" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking user status", error });
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
      <p>Click <a href="${process.env.REACT_APP_API_BASE_URL}/reset-password/${token}">here</a> to reset your password.</p>`,
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
console.log(process.env.REACT_APP_API_BASE_URL,"host env")

module.exports = {
  regPost,
  login,
  getUserData,
  Reset,
  familyName,
  Forgot,
  getUser,
  Request,
  getPendingRegistrations,
  checkUserStatus,
  rejectRegistration,
  approveRegistration,
  getApprovedUsers,
  rejectGetAll,
  getUserInfo,
};
