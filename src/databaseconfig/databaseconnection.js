const { Pool } = require("pg");
const dotenv = require("dotenv");
const Logger = require("../utils/logger");
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
