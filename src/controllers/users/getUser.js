const {
  SUCCESS_CODE,
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../../utils/statusCodes");
const { USER_NOT_FOUND } = require("../../utils/strings");
const { getUserById } = require("../../databaseconfig/queries");
const { pool } = require("../../databaseconfig/databaseconnection");

const getUserByIdController = async (req, res) => {
  const { id } = req.params;
let client
  try {
     client = await pool.connect();
    const result = await client.query(await getUserById(id));

    if (result.rows.length === 0) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: USER_NOT_FOUND });
    }

    res.status(SUCCESS_CODE).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ success: false, message: "Server error" });
  }finally  {
    if (client) client.release();

  }
};

module.exports = getUserByIdController;
