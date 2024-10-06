const User = require("../../Models/Users");
const {
  SUCCESS_CODE,
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../../utils/statusCodes");
const { USER_NOT_FOUND } = require("../../utils/strings");
const jwt = require("jsonwebtoken");

const getUserByIdController = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token
  if (!token) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Token is required." });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.user_id; // Extract user ID from the token
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Invalid token." });
  }
  const { id } = req.params;

  try {
    // Find the user by id
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: USER_NOT_FOUND });
    }

    res.status(SUCCESS_CODE).json({ success: true, data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => err.errors[key].message);
      return res.status(BAD_REQUEST_CODE).json({ success: false, message: errors });
    }
    console.error(err);
    res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ success: false, message: "Server error" });
  }
};

module.exports = getUserByIdController;
