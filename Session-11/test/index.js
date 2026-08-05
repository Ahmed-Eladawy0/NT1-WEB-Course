const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();


const express = require("express");
const courseRouter = require("./routes/course-routes");
const dbConnect = require("./config/db-connect");


dbConnect();

const app = express();



app.use(express.json());

app.use("/api/v1/courses", courseRouter);


app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
}); 