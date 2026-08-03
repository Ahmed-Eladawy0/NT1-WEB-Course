const express = require("express");
const app = express();
app.use(express.json());
app.get("/api/v1/courses", (req, res) => {
  res.status(200).json({
    status: "success",
    count: courses.length,
    data: {
      courses,
    },
  });
});

app.post("/api/v1/courses", (req, res) => {
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
});

app.put("/api/v1/courses/:id", (req, res) => {
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
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});