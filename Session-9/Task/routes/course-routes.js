const coursecontroller = require("../controllers/course-controllers");
const express = require("express");
const router = express.Router();
router
    .route("")
    .get(coursecontroller.getAllCourses)
    .post(coursecontroller.CreateCourse);
router.route("/:id")
    .put(coursecontroller.putCourse)
    .get(coursecontroller.getCourseById)
    .patch(coursecontroller.patchCourse)
    .delete(coursecontroller.deleteCourse);
module.exports = router;