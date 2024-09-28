// Helper function to validate email format
exports.validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};


// Helper function to validate phone number 
exports.validatePhoneNumber = (phone_number) => {
    const re = /^[0-9]{10,15}$/;
    return re.test(String(phone_number));
  };