const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SUCCESS_CODE, BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE } = require("../../utils/statusCodes");
const { USER_NOT_FOUND, LOGIN_SUCCESS, INVALID_CREDENTIALS } = require("../../utils/strings");
const { validateEmail } = require("../../helpers/user");
const User = require("../../Models/Users");

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Email and password are required." });
  }

  if (!validateEmail(email)) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Invalid email format." });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(BAD_REQUEST_CODE).json({ success: false, message: USER_NOT_FOUND });
    }

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(BAD_REQUEST_CODE).json({ success: false, message: INVALID_CREDENTIALS });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user._id, email: user.email },
      process.env.JWT_SECRET
      // { expiresIn: "1h" }
    );

    res.status(SUCCESS_CODE).json({ success: true, message: LOGIN_SUCCESS, token });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => err.errors[key].message);
      return res.status(BAD_REQUEST_CODE).json({ success: false, message: errors });
    }
    console.error("Login error:", err);
    res.status(INTERNAL_SERVER_ERROR_CODE).json({ success: false, message: "Server error" });
  }
};

module.exports = login;
