const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [255, "Name must be less than 255 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    validate: {
      validator: function (email) {
        // Email validation regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: "Invalid email format",
    },
  },
  phone_number: {
    type: String,
    validate: {
      validator: function (phone_number) {
        return /^\+?[1-9]\d{1,14}$/.test(phone_number);
      },
      message: "Invalid phone number format",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  user_type: {
    type: String,
    required: [true, "User type is required"],
    enum: ['buyer', 'seller', 'both'],
    default: 'buyer' ,
    message: "User type must be either Buyer, Seller",
  },
  registration_date: {
    type: Date,
    default: Date.now,
  },
  profile_picture: {
    type: String,
    trim: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  otp: String,
  otpExpiresAt: Date,
});

// Pre-save hook to hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
