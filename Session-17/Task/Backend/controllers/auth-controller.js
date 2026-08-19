const User = require("../models/user-model");
const generateToken = require("../utils/get-jwt");
const bcrypt = require("bcryptjs");
const deleteUploadedFile = require("../utils/delete-uploaded-file");

// (Login)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Email and Password are required.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const comparePasswords = await bcrypt.compare(password, user.password);
    if (!comparePasswords) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    user.password = undefined;
    const token = generateToken(user);

    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Signup
const signupUser = async (req, res) => {
  try {
    const user = await User.create({
      ...req.body,
      role: "student",
      imageUrl: req.file ? req.file.filename : "default-user.webp",
    });

    const token = generateToken(user);

    res.status(201).json({
      status: "success",
      message: "Account created successfully",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    if (req.file) {
      deleteUploadedFile("users", req.file.filename);
    }
    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists",
      });
    }
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get all users (for admin purposes)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      count: users.length,
      data: { users },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Change user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    user.role = user.role === "admin" ? "student" : "admin";
    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      message: "User role updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }
    if (deletedUser.imageUrl && deletedUser.imageUrl !== "default-user.webp") {
      deleteUploadedFile("users", deletedUser.imageUrl);
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get User Profile (Protected)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("myCourses");
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }
    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Edit profile (Protected)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.phone) user.phone = req.body.phone;

    if (req.file) {
      if (user.imageUrl && user.imageUrl !== "default-user.webp") {
        deleteUploadedFile("users", user.imageUrl);
      }
      user.imageUrl = req.file.filename;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    if (req.file) {
      deleteUploadedFile("users", req.file.filename);
    }
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Enroll Course (Protected)
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body; 
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    if (!user.myCourses.includes(courseId)) {
      user.myCourses.push(courseId);
      await user.save();
    }

    res.status(200).json({
      status: "success",
      message: "Enrolled successfully",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  loginUser,
  signupUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateProfile,
  enrollCourse,
  getUserProfile
};