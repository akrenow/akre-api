const { SUCCESS_CODE, BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE } = require("../../utils/statusCodes");
const { USER_NOT_FOUND, DELETE_SUCCESS } = require("../../utils/strings");
const { deleteUserById } = require("../../databaseconfig/queries");
const { pool } = require("../../databaseconfig/databaseconnection");

const deleteUserController = async (req, res) => {
  const { id } = req.params;
  let client 
  try {
     client = await pool.connect();
    const result = await client.query(await deleteUserById(id));

    if (result.rows.length === 0) {
      return res.status(BAD_REQUEST_CODE).json({ success: false, message: USER_NOT_FOUND });
    }

  res.status(SUCCESS_CODE).json({ success: true, message: DELETE_SUCCESS });
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR_CODE).json({ success: false, message: 'Server error' });
  }finally  {
    if (client) client.release();

  }
};

module.exports = deleteUserController;
