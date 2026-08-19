const express = require("express");
const courseControllers = require("../controllers/course-controllers");
const multerUpload = require("../middlewares/multer-middleware");
const authenticateMiddleware = require("../middlewares/authenticate-middleware");
const authorizeMiddleware = require("../middlewares/authorize-middleware");

const router = express.Router();

router.route("/")
  .get(courseControllers.getAllCourses) 
  .post(
    authenticateMiddleware,
    authorizeMiddleware("admin"), 
    multerUpload.single("imageUrl"),
    courseControllers.createCourse
  );

router.route("/:id")
  .get(courseControllers.getCourseById) 
  .patch(
    authenticateMiddleware,
    authorizeMiddleware("admin"), 
    multerUpload.single("imageUrl"),
    courseControllers.updateCourse
  )
  .delete(
    authenticateMiddleware,
    authorizeMiddleware("admin"),
    courseControllers.deleteCourse
  );

module.exports = router;