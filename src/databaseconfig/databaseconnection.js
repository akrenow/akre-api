const { Pool } = require("pg");
const dotenv = require("dotenv");
const Logger = require("../utils/logger");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

dotenv.config();

//Database configuration
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

pool.on("connect", () => {
  Logger.info("connected to the postgres");
});

pool.on("error", () => {
  Logger.info("error occured");
});
pool.on("release", () => {
  Logger.info("client released");
});

module.exports = { pool };


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

  // Initialize GridFS Bucket
  let gfsBucket;
  conn.once("open", () => {
    console.log("MongoDB connected");
    // Creating a new bucket called 'mycustombucket'
    gfsBucket = new GridFSBucket(conn.db, {
      bucketName: "mycustombucket", // Custom bucket name
    });
  });