const express = require("express");
const router = express.Router();
const {
  loginUser,
  signupUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
  enrollCourse,
  updateProfile,
} = require("../controllers/auth-controller");

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.post("/users/:id/enroll", enrollCourse);
router.patch("/users/:id/profile", updateProfile);

module.exports = router;