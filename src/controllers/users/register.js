const bcrypt = require("bcrypt");
const { SUCCESS_CODE, INTERNAL_SERVER_ERROR_CODE, BAD_REQUEST_CODE } = require("../../utils/statusCodes");
const { createUser, checkEmailExists } = require("../../databaseconfig/queries");
const { REGISTRATION_SUCCESS, EMAIL_EXISTS } = require("../../utils/strings");
const { pool } = require("../../databaseconfig/databaseconnection");
const { validateEmail, validatePhoneNumber } = require("../../helpers/user");


const register = async (req, res) => {
  let client;
  const { name, email, phone_number, password, user_type, profile_picture } = req.body;

  if (!name || !email || !password || !user_type) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Missing required fields" });
  }

  if (!validateEmail(email)) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Invalid email format" });
  }

  if (phone_number && !validatePhoneNumber(phone_number)) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Invalid phone number format" });
  }

  // Validate user_type
  const allowedUserTypes = ["Buyer", "Seller", "Agent"];
  if (!allowedUserTypes.includes(user_type)) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Invalid user type" });
  }

  try {
     client = await pool.connect();
    // Check if email already exists
    const emailCheckQuery = await client.query(await checkEmailExists(email));
    if (emailCheckQuery.rows.length > 0) {
      return res.status(BAD_REQUEST_CODE).json({ success: false, message: EMAIL_EXISTS });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const result = await client.query(
     await createUser(name, email, phone_number, hashedPassword, user_type, profile_picture)
    );

    res.status(SUCCESS_CODE).json({success: true,message: REGISTRATION_SUCCESS,data: result.rows[0]});
    
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR_CODE).json({ success: false, message: "Server error" });
  } finally  {
    if (client) client.release();

  }
};

module.exports = register;
