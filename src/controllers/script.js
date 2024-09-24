const { pool } = require("../databaseconfig/databaseconnection");
const fs = require("fs-extra");
const Logger = require("../utils/logger");
var sql = fs.readFileSync("script.sql").toString();
const {
  SUCCESS_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/statusCodes");
const {
  FAILED_RESPONSE_SENT_TEMPLATE,
  UPDATE_SUCCESS,
  UPDATE_FAILED,
  SUCCESS_REQUEST_MSG,
} = require("../utils/strings");

const script = async (req, res) => {
  const client = await pool.connect();
  client.query(sql, function (err) {
    if (err) {
      Logger.error(`something went wrong while creating tables ${err}`);
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .json({ success: false, message: UPDATE_FAILED });
      Logger.error(
        FAILED_RESPONSE_SENT_TEMPLATE.replace("$apicall", "/script")
      );
      return;
    }
    Logger.info("Tables created");
    client.release();
    res.status(SUCCESS_CODE).json({ success: true, message: UPDATE_SUCCESS });
    Logger.info(SUCCESS_REQUEST_MSG.replace("$apicall", "/script"));
    return;
  });
};

module.exports = script;
