const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course-controllers");

router.route("/").get(getAllCourses).post(createCourse);

router.route("/:id").put(updateCourse).delete(deleteCourse);

module.exports = router;