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
  getUserProfile
} = require("../controllers/auth-controller");

const multerUpload = require("../middlewares/multer-middleware");
const authenticateMiddleware = require("../middlewares/authenticate-middleware");
const authorizeMiddleware = require("../middlewares/authorize-middleware");

// 1. Public Routes
router.post("/login", loginUser);
router.post("/signup", multerUpload.single("imageUrl"), signupUser);

// 2. Protected Routes
router.use(authenticateMiddleware);
router.get("/profile", getUserProfile);
router.patch("/profile", multerUpload.single("imageUrl"), updateProfile);
router.post("/enroll", enrollCourse);

// 3. Admin Only Routes
router.use(authorizeMiddleware("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;