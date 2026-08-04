const express = require("express");
const cors = require("cors");
const courseRouter = require("./routes/course-routes");
const authRouter = require("./routes/auth-routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});