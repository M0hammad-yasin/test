const { User } = require("../mongoose");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
// const multer = require("multer");

// Register Endpoint
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if name was entered
    if (!name) {
      return res.json({
        error: "name is required",
      });
    }
    // check if password is good
    if (!password || password.length < 6) {
      return res.json({
        error:
          "password is required and  it should be atleast 6 characters long",
      });
    }
    // check email
    if (!email) {
      return res.json({
        error: "email is required",
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email already exists",
      });
    }

    const existingName = await User.findOne({ name });
    if (existingName) {
      return res.json({
        error: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);
    // create user in database

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

// Login Endpoint

const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    // check if user exist
    const user = await User.findOne({ name });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }

    // check if password match
    const match = await comparePassword(password, user.password);

    if (match) {
      jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) {
            console.log("inside func");
            console.error("Error generating JWT:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          res.cookie("token", token).json(user);
        }
      );
    }

    if (!match) {
      return res.json({
        error: "wrong password! Try Again",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// getProfile Endpoint
const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

// Logout Endpoint

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "User logged out successfully" });
};

// Authentication Middleware
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded;
    console.log(token);
    console.log(decoded);
    next();
  });
};

// Update Profile

const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let img;
    console.log("checking name");
    console.log(name);
    // Check if an image file was uploaded
    if (req.file) {
      img = req.file.path;
    }

    const hashedPassword = await hashPassword(password);

    // Update user document in the database

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, password: hashedPassword, img },
      { new: true }
    );

    // Check if user document was found and updated
    if (!updatedUser) {
      console.log("User not found for update");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User updated successfully:", updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  updateProfile,
  authenticateUser,
};
