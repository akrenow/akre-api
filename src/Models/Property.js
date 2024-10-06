const mongoose = require("mongoose");


const propertySchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller", // Reference to the Seller model
    required: true,
  },
  land_media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LandMedia", // Reference to the LandMedia model
      required: true,
    }
  ],  
  division_info: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division", // Reference to the Division model
    },
  ],
  property_type: {
    type: String,
    enum: ["land", "plot"],
    default: "land",
  },
  land_bookmark_data: [
    {
      id: { type: Number, required: true }, // Bookmark ID
      akre_premium: { type: Boolean, default: false }, // Premium land flag
      chance: { type: Boolean, default: false }, // Chance of availability
      site_verification: { type: Boolean, default: false }, // Site verified or not
      investors: { type: Boolean, default: false }, // Investor interest
    },
  ],
  water_source_data: [
    {
      id: { type: Number, required: true }, // Water source ID
      well: { type: Boolean, default: false }, // Well water available
      canal: { type: Boolean, default: false }, // Canal water available
      drip: { type: Boolean, default: false }, // Drip irrigation present
      sprinkler: { type: Boolean, default: false }, // Sprinkler irrigation present
      bore_well: { type: Boolean, default: false }, // Borewell present
      stream: { type: Boolean, default: false }, // Stream water available
    },
  ],
  created_by: {
    id: { type: Number, required: true }, // Creator ID 
    name: { type: String, required: true }, // Creator name
  },
  is_shortlisted: { type: Boolean, default: false }, // If property is shortlisted
  is_basic_verified: { type: Boolean, default: true }, // Basic verification status
  total_land_size_in_acres: {
    acres: { type: Number, required: true }, // Total size in acres
  },
  price_per_acre_crore: {
    crore: { type: Number, default: 0 }, // Price in crores per acre
    lakh: { type: Number, default: 0 }, // Price in lakhs per acre
  },
  slug: { type: String, required: true }, // Slug for the property URL
  total_price: { type: Number, required: true }, // Total price of the property
  price_per_acre: { type: Number, required: true }, // Price per acre
  lat: { type: String }, //optional //Latitude of the property
  long: { type: String },//optional // Longitude of the property
  status: {
    type: String,
    enum: ["active", "sold", "inactive"],
    default: "active",
  }, // Property status
  verification_status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  }, // Verification status
  is_physically_verified: { type: Boolean, default: false }, // Physical verification status
  approach_road: { type: Boolean, default: true }, // Presence of approach road
  fencing: { type: Boolean, default: false }, // Whether the property is fenced
  soil_type: {
    type: String,
    enum: ["Black", "Red", "Loamy"],
    default: "Black",
  }, // Type of soil
  crop_type: { type: String, default: null }, // Type of crop grown on the land
  created_at: { type: Date, default: Date.now }, // Creation date
  updated_at: { type: Date, default: Date.now }, // Last update date
  distance_from_highway: { type: Number }, // Distance from the nearest highway (in km)
  approach_road_length: { type: Number, default: 0 }, // Length of the approach road in meters
  approach_road_type: {
    type: String,
    enum: ["blacktop", "gravel", "mud"],
    default: "blacktop",
  }, // Type of approach road
  fencing_description: { type: String, default: "" }, // Description of the fencing (if any)
  location_link: { type: String, default: "" }, // Google Maps link to the location
  survey_number: { type: String, default: "" }, // Survey number of the land
  electricity: { type: Boolean, default: false }, // Whether electricity is available
  existing_structure: { type: String, default: null }, // Description of existing structures (if any)
  additional_info: { type: String, default: null }, // Additional information
  tags: { type: [String], default: [] }, // Tags for searchability
});

// Create a Mongoose model
const Property = mongoose.model("Property", propertySchema);

module.exports = Property; 