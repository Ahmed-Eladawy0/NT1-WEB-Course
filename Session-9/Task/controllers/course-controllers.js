const fs= require("fs");
let courses = JSON.parse(fs.readFileSync("./data/courses-data.json", "utf-8"));
const getAllCourses = (req, res) => {
  res.status(200).json({
    status: "success",
    count: courses.length,
    data: {
      courses,
    },
  });
}
const putCourse = (req, res) => {
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
}
const getCourseById = (req, res) => {
  const courseId = Number(req.params.id);
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return res.status(404).json({
      status: "fail",
      message: "Course not found",
    });
  }  
  res.status(200).json({
    status: "success",
    data: {
      course,
    },
  });
}
const CreateCourse = (req, res) => {
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
}
const updateCourse = (req, res) => {
  const courseId = +req.params.id;
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return res.status(404).json({
      status: "fail",
      message: "Course not found",
    });
  }
  const updatedCourse = Object.assign({}, course, req.body);
  courses = courses.map((c) => (c.id === courseId ? updatedCourse : c));
  fs.writeFile(
    "./data/courses-data.json",
    JSON.stringify(courses, null, 2),
    err => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Failed to update course",
        });
      }
      res.status(200).json({
        status: "success",
        message: "Course updated successfully",
        data: {
          course: updatedCourse,
        },
      });
    }
  );
}
const deleteCourse = (req, res) => {
  const courseId = +req.params.id;
  const Index = courses.findIndex((c) => c.id === courseId);

  if (Index === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Course not found",
    });
  }

  courses.splice(Index, 1);

  fs.writeFile(
    "./data/courses-data.json",
    JSON.stringify(courses, null, 2),
    () => {
      res.status(200).json({
        status: "success",
        message: "Course deleted successfully",
      });
    }
  );
}
const patchCourse = (req, res) => {
  const courseId = +req.params.id;
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return res.status(404).json({
      status: "fail",
      message: "Course not found",
    });
  }
  const updatedCourse = Object.assign({}, course, req.body);
  courses = courses.map((c) => (c.id === courseId ? updatedCourse : c));
  fs.writeFile(
    "./data/courses-data.json",
    JSON.stringify(courses, null, 2),
    err => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Failed to update course",
        });
      }
      res.status(200).json({
        status: "success",
        message: "Course updated successfully",
        data: {
          course: updatedCourse,
        },
      });
    }
  );
}
module.exports = {
  getAllCourses,
  putCourse,
  getCourseById,
  CreateCourse,
  updateCourse,
  deleteCourse,
  patchCourse
}