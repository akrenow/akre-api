const {
  SUCCESS_CODE,
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../../utils/statusCodes");
const {
  USER_NOT_FOUND,
  LOGIN_SUCCESS,
  OTP_EXPIRED,USER_ALREADY_VERIFIED
} = require("../../utils/strings");
const { validateEmail } = require("../../helpers/user");
const { verifyOtp } = require("../../helpers/otp");
const jwt = require("jsonwebtoken");
const User = require("../../Models/Users");

const verifyOtpAndLogin = async (req, res) => {
  const { email, otp } = req.body;

  // Check if email and OTP are provided
  if (!email || !otp) {
    return res
      .status(BAD_REQUEST_CODE)
      .json({ success: false, message: "Email and OTP are required." });
  }

  if (!validateEmail(email)) {
    return res
      .status(BAD_REQUEST_CODE)
      .json({ success: false, message: "Invalid email format." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: USER_NOT_FOUND });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res
        .status(SUCCESS_CODE)
        .json({ success: false, message: USER_ALREADY_VERIFIED });
    }

    // Check if OTP has expired
    const currentTime = Date.now();
    if (user.otpExpiresAt && currentTime > user.otpExpiresAt) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: OTP_EXPIRED });
    }

    if (!verifyOtp(otp, user.otp)) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: "Invalid OTP." });
    }

    user.isVerified = true;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    res
      .status(SUCCESS_CODE)
      .json({ success: true, message: LOGIN_SUCCESS, token });
  } catch (err) {
    console.error("OTP verification error:", err);
    res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ success: false, message: "Server error" });
  }
};

module.exports = verifyOtpAndLogin;
