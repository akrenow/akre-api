const crypto = require("crypto");
const User = require("../../Models/Users");
const {
  SUCCESS_CODE,
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../../utils/statusCodes");
const { sendPasswordResetEmail } = require("../../helpers/email/emails");
const {
  USER_NOT_FOUND,
  RESET_PASSWORD_EMAIL_SENT,
  SERVER_ERROR,
} = require("../../utils/strings");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(BAD_REQUEST_CODE)
      .json({ success: false, message: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: USER_NOT_FOUND });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour expiration

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    return res
      .status(SUCCESS_CODE)
      .json({ success: true, message: RESET_PASSWORD_EMAIL_SENT });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ success: false, message: SERVER_ERROR });
  }
};

module.exports = forgotPassword;
