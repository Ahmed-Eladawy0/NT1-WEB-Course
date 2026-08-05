const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course-controllers");

router.route("/").get(getAllCourses).post(createCourse);
router.route("/:id").get(getCourseById).patch(updateCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;