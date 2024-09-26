const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {  SUCCESS_CODE,  BAD_REQUEST_CODE,  INTERNAL_SERVER_ERROR_CODE,} = require("../../utils/statusCodes");
const {  USER_NOT_FOUND,  LOGIN_SUCCESS,  INVALID_CREDENTIALS,} = require("../../utils/strings");
const { getUserByEmail } = require("../../databaseconfig/queries");
const { pool } = require("../../databaseconfig/databaseconnection");
const { validateEmail } = require("../../helpers/user");

const JWT_SECRET = process.env.JWT_SECRET;


const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Email and password are required." });
  }

  if (!validateEmail(email)) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Invalid email format." });
  }
  let client;

  try {
    client = await pool.connect();

    // Check if the user exists
    const result = await client.query(await getUserByEmail(email));
    const user = result.rows[0];

    if (!user) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: USER_NOT_FOUND });
    }

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: INVALID_CREDENTIALS });
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: user.user_id, email: user.email },JWT_SECRET, { expiresIn: "1h" });

    res
      .status(SUCCESS_CODE)
      .json({ success: true, message: LOGIN_SUCCESS, token });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ success: false, message: "Server error" });
  }finally  {
    if (client) client.release();

  }
};

module.exports = login;
