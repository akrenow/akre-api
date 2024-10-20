const mongoose = require("mongoose");

// Define the seller schema
const sellerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  seller_type: {
    type: String,
    enum: ["agent", "owner"], // Seller can either be an agent or owner
    required: true,
  },
  is_verified: {
    type: Boolean,
    default: false, // Whether the seller is verified
  },
  profile_picture: {
    type: String,
    default: null, // URL to the seller's profile picture
  },
  total_lands_count: {
    type: Number,
    default: 0, // Number of lands the seller has sold
  },
  total_plots_count: {
    type: Number,
    default: 0, // Number of plots the seller has sold
  },
  created_at: {
    type: Date,
    default: Date.now, // Record creation time
  },
  updated_at: {
    type: Date,
    default: Date.now, // Record last update time
  },
});

// Create and export the Seller model
const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
