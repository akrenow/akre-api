const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  propertyId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  areaSize: { type: Number, required: true },
  propertyType: { type: String, required: true },
  listingDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["active", "sold", "pending"],
    default: "active",
  },
  furnishingStatus: {
    type: String,
    enum: ["furnished", "semi-furnished", "unfurnished"],
    default: "unfurnished",
  },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "videos" }, // Reference to video file in GridFS
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "images" }], // Reference to image files in GridFS
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
