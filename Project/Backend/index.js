require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/db-connect");
const courseRouter = require("./routes/course-routes");
const authRouter = require("./routes/auth-routes");
const app = express();

app.use(cors());
app.use(express.json());
dbConnect();
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});