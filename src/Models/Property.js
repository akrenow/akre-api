const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  media: [
    {
      media_type: { type: String, enum: ["image", "video"], required: true }, // Image or video
      file_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // GridFS file ID
      filename: { type: String, required: true }, // File name
    },
  ],
  division_info: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
    },
  ],
  property_type: {
    type: String,
    enum: ["land", "plot", "house", "apartment"],
    default: "land",
  },
  created_by: {
    id: { type: Number },
    name: { type: String },
  },
  is_shortlisted: { type: Boolean, default: false },
  price_per_acre: { type: Number, default: 0, required: true },
  total_price: { type: Number, required: true },
  general_info: {
    patadhar_name: { type: String, default: null }, // Patadhar (landowner) name
    survey_number: { type: String, default: null },
    hissa_number: { type: String, default: null },
    extent: { type: Number, default: null }, // Size or extent of the property
    owner_mobile_number: { type: String, default: null },
    land_mark: { type: String, default: null },
  },

  // House-specific fields
  house_info: {
    house_no: { type: String, default: null },
    house_type_bhk: { type: String, default: null },
    sq_feet: { type: Number, default: null },
  },

  // Apartment-specific fields
  apartment_info: {
    flat_no: { type: String, default: null },
    apartment_name: { type: String, default: null },
    floor: { type: Number, default: null },
    sq_feet: { type: Number, default: null },
  },

  // Property Location
  lat: { type: String },
  long: { type: String },
  location_link: { type: String, default: null },

  // Property Status
  status: {
    type: String,
    enum: ["active", "sold", "inactive"],
    default: "active",
  },

  verification_status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  is_physically_verified: { type: Boolean, default: false },

  // Additional Details
  approach_road: { type: Boolean, default: true },
  approach_road_length: { type: Number, default: null },
  approach_road_type: {
    type: String,
    default: null,
  }, // Type of approach road
  fencing: { type: Boolean, default: false },
  fencing_description: { type: String, default: null },
  soil_type: {
    type: String,
    default: null,
  }, // Type of soil
  crop_type: { type: String, default: null },
  electricity: { type: Boolean, default: false },
  existing_structure: { type: String, default: null }, // Description of existing structures (if any)
  additional_info: { type: String, default: null },
  tags: { type: [String], default: [] }, // Tags for searchability

  // Metadata
  slug: { type: String }, // Slug for the property URL
  created_at: { type: Date, default: Date.now }, // Creation date
  updated_at: { type: Date, default: Date.now }, // Last update date
});

// Create a Mongoose model
const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
