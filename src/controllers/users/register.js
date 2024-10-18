const {
  CREATED_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  BAD_REQUEST_CODE,
  SUCCESS_CODE,
} = require("../../utils/statusCodes");
const {
  EMAIL_EXISTS,
  OTP_EXPIRED,
  NEW_OTP_SENT,
} = require("../../utils/strings");
const { generateOtp } = require("../../helpers/otp");
const User = require("../../Models/Users");
const { sendVerificationEmail } = require("../../helpers/email/emails");

const register = async (req, res) => {
  const { name, email, phone_number, password, user_type, profile_picture } =
    req.body;

  if (!name || !email || !password) {
    return res
      .status(BAD_REQUEST_CODE)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    // Check if email already exists
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      // Check if the user is already verified
      if (emailExists.isVerified) {
        return res
          .status(SUCCESS_CODE)
          .json({ success: false, message: "This email is already verified." });
      }

      // Check if OTP has expired
      if (emailExists?.otpExpiresAt && Date.now() > emailExists?.otpExpiresAt) {
        // OTP expired, generate a new one
        const newOtp = await generateOtp();
        emailExists.otp = newOtp;
        emailExists.otpExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiration
        await emailExists.save();

        // Send new OTP to the user's email
        await sendVerificationEmail(email, newOtp);
        return res
          .status(SUCCESS_CODE)
          .json({ success: true, message: NEW_OTP_SENT });
      } else {
        // OTP is still valid
        return res
          .status(SUCCESS_CODE)
          .json({ success: true, message: EMAIL_EXISTS });
      }
    } else {
      // Create and save the new user
      const otp = await generateOtp();
      const user = new User({
        name,
        email,
        phone_number,
        password, // Password will be hashed automatically by the pre-save hook
        user_type: user_type || "buyer", // Default user type is buyer
        profile_picture,
        otp,
        otpExpiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes expiration
      });
      await user.save();

      // Send OTP to user email
      await sendVerificationEmail(email, otp);
      return res.status(CREATED_CODE).json({
        success: true,
        message: "OTP sent to your email. Please verify.",
      });
    }
  } catch (err) {
    console.log(err.message);
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => err.errors[key].message);
      return res.status(BAD_REQUEST_CODE).json({ success: false, message: errors });
    }
    res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ success: false, message: err.message });
  }
};

module.exports = register;
