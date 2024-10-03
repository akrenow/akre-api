// src/index.js
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const mainRouter = require("./src/routes/router");
const { db_connection } = require("./src/databaseconfig/databaseconnection");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

const port = process.env.PORT || 8000;

db_connection();

app.use("/", mainRouter);

app.listen(port, async () => {
  console.log(
    `[server]: ${process.env.NODE_ENV}, Hi Server is running at http://localhost:${port}`
  );
});
