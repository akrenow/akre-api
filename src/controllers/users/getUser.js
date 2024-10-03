const User = require("../../Models/Users");
const {
  SUCCESS_CODE,
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../../utils/statusCodes");
const { USER_NOT_FOUND } = require("../../utils/strings");

const getUserByIdController = async (req, res) => {
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
