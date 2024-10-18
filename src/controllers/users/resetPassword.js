const User = require("../../Models/Users");
const {
  SUCCESS_CODE,
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../../utils/statusCodes");
const { sendResetSuccessEmail } = require("../../helpers/email/emails");
const {
  INVALID_OR_EXPIRED_TOKEN,
  PASSWORD_RESET_SUCCESSFUL,
} = require("../../utils/strings");

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: "Password is required." });
    }

    // Find the user by the reset token and ensure it's not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: INVALID_OR_EXPIRED_TOKEN });
    }

    // Update user's password and remove reset token and expiration fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    // Send a success email after password reset
    await sendResetSuccessEmail(user.email);

    return res
      .status(SUCCESS_CODE)
      .json({ success: true, message: PASSWORD_RESET_SUCCESSFUL });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ success: false, message: error.message || "Server error" });
  }
};

module.exports = resetPassword;
