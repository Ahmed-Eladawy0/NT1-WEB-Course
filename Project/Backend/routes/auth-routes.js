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

const multerUpload = require("../middlewares/multer-middleware");
// --- Auth Routes ---
router.post("/login", loginUser);
router.post("/signup", multerUpload.single("imageUrl"), signupUser);
// --- User Management Routes ---
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.post("/users/:id/enroll", enrollCourse);
router.patch("/users/:id/profile", multerUpload.single("imageUrl"), updateProfile);

module.exports = router;