const express = require("express");
const courseRoutes = require("./routes/course-routes");
const app = express();
app.use(express.json());
app.use("/api/v1/courses", courseRoutes);
app.listen(5000, () => {
  console.log("Server listening on port 5000");
});