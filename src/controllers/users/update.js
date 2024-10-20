const User = require("../../Models/Users");
const {
  SUCCESS_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  BAD_REQUEST_CODE,
} = require("../../utils/statusCodes");
const { USER_NOT_FOUND, UPDATE_SUCCESS } = require("../../utils/strings");
const jwt = require("jsonwebtoken");

const updateUserController = async (req, res) => {
  // Extract user ID from the token
  const token = req.headers.authorization?.split(" ")[1]; 
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

  const { name, phone_number, user_type, profile_picture } = req.body;

  try {
    // Find user by ID and update the provided fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone_number, user_type, profile_picture },
      { new: true, runValidators: true } // Return the updated document and validate fields
    );

    if (!updatedUser) {
      return res.status(BAD_REQUEST_CODE).json({ success: false, message: USER_NOT_FOUND });
    }

    res.status(SUCCESS_CODE).json({ success: true, message: UPDATE_SUCCESS, data: updatedUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => err.errors[key].message);
      return res.status(BAD_REQUEST_CODE).json({ success: false, message: errors });
    }
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR_CODE).json({ success: false, message: "Server error" });
  }
};

module.exports = updateUserController;
