const express = require("express");
const router = express.Router();
const courseControllers = require("../controllers/course-controllers");
const multerUpload = require("../middleware/multer-middleware");

router.route("/")
  .get(courseControllers.getAllCourses)
  .post(multerUpload.single("imageUrl"), courseControllers.createCourse);

router.route("/:id")
  .get(courseControllers.getCourseById)
  .patch(multerUpload.single("imageUrl"), courseControllers.updateCourse)
  .delete(courseControllers.deleteCourse);

module.exports = router;