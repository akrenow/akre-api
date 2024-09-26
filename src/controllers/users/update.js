const { SUCCESS_CODE, INTERNAL_SERVER_ERROR_CODE, BAD_REQUEST_CODE } = require("../../utils/statusCodes");
const { USER_NOT_FOUND, UPDATE_SUCCESS } = require("../../utils/strings");
const { updateUserById } = require("../../databaseconfig/queries");
const { pool } = require("../../databaseconfig/databaseconnection");

const updateUserController = async (req, res) => {
  const { id } = req.params;
  const { name, phone_number, user_type, profile_picture } = req.body;
  let client

  try {
     client = await pool.connect();
    const result = await client.query(
      await updateUserById(id, name, phone_number, user_type, profile_picture)
    );

    if (result.rows.length === 0) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: USER_NOT_FOUND });
    }

    res
      .status(SUCCESS_CODE)
      .json({ success: true, message: UPDATE_SUCCESS, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ success: false, message: "Server error" });
  }finally  {
    if (client) client.release();

  }
};

module.exports = updateUserController;
