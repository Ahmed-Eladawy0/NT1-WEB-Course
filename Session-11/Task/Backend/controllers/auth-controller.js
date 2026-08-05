const fs = require("fs");
const path = require("path");

let users = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/users-data.json"), "utf-8")
);

// (Login)
const loginUser = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid email or password",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    data: {
      user // بنرجع الكائن كامل بكل بياناته (phone, avatar, enrolledCourses) من غير نقص
    }
  });
};

// Signup
const signupUser = (req, res) => {
  const { name, email, password } = req.body;
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      status: "fail",
      message: "Email already exists",
    });
  }

  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name,
    email,
    password,
    role: "user",
    phone: "",
    avatar: "",
    enrolledCourses: []
  };

  users.push(newUser);

  fs.writeFile(
    path.join(__dirname, "../data/users-data.json"),
    JSON.stringify(users, null, 2),
    () => {
      res.status(201).json({
        status: "success",
        message: "Account created successfully",
        data: {
          user: newUser
        }
      });
    }
  );
};
// Get all users (for admin purposes)
const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    count: users.length,
    data: { users }
  });
};

// Change user role (admin only)
const updateUserRole = (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }

  user.role = user.role === "admin" ? "user" : "admin";

  fs.writeFile(
    path.join(__dirname, "../data/users-data.json"),
    JSON.stringify(users, null, 2),
    () => {
      res.status(200).json({
        status: "success",
        message: "User role updated successfully",
        data: { user }
      });
    }
  );
};
//Delete user (admin only)
const deleteUser = (req, res) => {
  const userId = Number(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }

  users.splice(userIndex, 1);

  fs.writeFile(
    path.join(__dirname, "../data/users-data.json"),
    JSON.stringify(users, null, 2),
    () => {
      res.status(200).json({
        status: "success",
        message: "User deleted successfully"
      });
    }
  );
};
// edit profile (user only)
const updateProfile = (req, res) => {
  const userId = Number(req.params.id);
  const { name, phone, avatar } = req.body;
  
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (avatar) user.avatar = avatar;

  fs.writeFile(
    path.join(__dirname, "../data/users-data.json"),
    JSON.stringify(users, null, 2),
    () => {
      res.status(200).json({
        status: "success",
        message: "Profile updated successfully",
        data: { user }
      });
    }
  );
};
// Enroll Course
const enrollCourse = (req, res) => {
  const userId = Number(req.params.id);
  const { courseTitle } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }

  if (!user.enrolledCourses) {
    user.enrolledCourses = [];
  }

  if (!user.enrolledCourses.includes(courseTitle)) {
    user.enrolledCourses.push(courseTitle);
  }

  fs.writeFile(
    path.join(__dirname, "../data/users-data.json"),
    JSON.stringify(users, null, 2),
    () => {
      res.status(200).json({
        status: "success",
        message: "Enrolled successfully",
        data: { user }
      });
    }
  );
};

module.exports = { loginUser, signupUser, getAllUsers, updateUserRole , deleteUser, updateProfile, enrollCourse };