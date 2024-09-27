// src/index.js
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./src/routes/router");
const Grid = require("gridfs-stream");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

const port = process.env.PORT || 8000;

//database connection mongodb
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Connection error", err);
  });

const conn = mongoose.connection;

// Init gfs for GridFS
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads"); // Files will be stored in 'uploads' collection
});

app.use("/", mainRouter);

app.listen(port, async () => {
  console.log(
    `[server]: ${process.env.NODE_ENV}, Hi Server is running at http://localhost:${port}`
  );
});
