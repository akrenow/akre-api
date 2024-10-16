const { SUCCESS_CODE, INTERNAL_SERVER_ERROR_CODE, BAD_REQUEST_CODE } = require("../../utils/statusCodes");
const { REGISTRATION_SUCCESS, EMAIL_EXISTS } = require("../../utils/strings");
const { validateEmail, validatePhoneNumber } = require("../../helpers/user");
const { generateOtp } = require("../../helpers/otp");
const User = require("../../Models/Users");
const { sendVerificationEmail } = require("../../helpers/email/emails");

const register = async (req, res) => {
  const { name, email, phone_number, password, user_type, profile_picture } = req.body;

  if (!name || !email || !password || !user_type) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Missing required fields" });
  }

  // if (!validateEmail(email)) {
  //   return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Invalid email format" });
  // }

  // if (phone_number && !validatePhoneNumber(phone_number)) {
  //   return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Invalid phone number format" });
  // }

    // Validate user_type
  const allowedUserTypes = ["Buyer", "Seller", "Agent"];

  if (!allowedUserTypes.includes(user_type)) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Invalid user type" });
  }

  try {
        // Check if email already exists
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(BAD_REQUEST_CODE).json({ success: false, message: EMAIL_EXISTS });
    }
    // Create and save the new user
    const otp = generateOtp();
    const user = new User({
      name,
      email,
      phone_number,
      password, // Password will be hashed automatically by the pre-save hook
      user_type,
      profile_picture,
  	  otp,
			otpExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    await user.save();

    // Send OTP to user email
    await sendVerificationEmail(email,otp)
    res.status(SUCCESS_CODE).json({ success: true, message: "OTP sent to your email. Please verify." });
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR_CODE).json({ success: false, message: err.message });
  }
};

module.exports = register;
