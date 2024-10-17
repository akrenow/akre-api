const crypto = require('crypto');

const generateOtp = async () => {
  const otp = await Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
  return otp;
};

const verifyOtp = (inputOtp, storedOtp) => {
  return inputOtp === storedOtp;
};

module.exports = {
  generateOtp,
  verifyOtp,
};
