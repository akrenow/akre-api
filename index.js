// src/index.js
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const cors = require("cors");
const mainRouter = require("./src/routes/router");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

const port = process.env.PORT || 8000;

app.use("/", mainRouter);

app.listen(port, async () => {
  console.log(
    `[server]: ${process.env.NODE_ENV}, Hr Server is running at http://localhost:${port}`
  );
});
