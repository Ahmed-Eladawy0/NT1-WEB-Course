const fs = require("fs");

let courses = JSON.parse(
  fs.readFileSync("./data/courses-data.json", "utf-8")
);

// Get all courses
const getAllCourses = (req, res) => {
  res.status(200).json({
    status: "success",
    count: courses.length,
    data: {
      courses,
    },
  });
};

// Add new course
const createCourse = (req, res) => {
  const newId = courses.length > 0 ? courses[courses.length - 1].id + 1 : 1;

  const newCourse = {
    id: newId,
    ...req.body,
  };

  courses.push(newCourse);

  fs.writeFile(
    "./data/courses-data.json",
    JSON.stringify(courses, null, 2),
    () => {
      res.status(201).json({
        status: "success",
        message: "New course added",
        data: {
          course: newCourse,
        },
      });
    }
  );
};

// Update course
const updateCourse = (req, res) => {
  const courseId = Number(req.params.id);
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return res.status(404).json({
      status: "fail",
      message: "Course not found",
    });
  }

  course.title = req.body.title || course.title;
  course.instructor = req.body.instructor || course.instructor;
  course.price = req.body.price || course.price;

  fs.writeFile(
    "./data/courses-data.json",
    JSON.stringify(courses, null, 2),
    () => {
      res.status(200).json({
        status: "success",
        message: "Course updated successfully",
        data: {
          course,
        },
      });
    }
  );
};

// Delete course
const deleteCourse = (req, res) => {
  const courseId = Number(req.params.id);
  const courseIndex = courses.findIndex((c) => c.id === courseId);

  if (courseIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Course not found",
    });
  }

  courses.splice(courseIndex, 1);

  fs.writeFile(
    "./data/courses-data.json",
    JSON.stringify(courses, null, 2),
    () => {
      res.status(200).json({
        status: "success",
        message: "Course deleted successfully",
        data: null,
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

module.exports = {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
};