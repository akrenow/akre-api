const mongoose = require("mongoose");

const landMediaSchema = new mongoose.Schema({
    // property_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Property', // Reference to the Property model
    //     required: true
    // },
    video: { type: String, default: null }, // URL for video (if any)
    image: { type: String, required: true }, // URL for image
    media_type: { type: String, enum: ['image', 'video'], required: true }, // Type of media
    category: { type: String, required: true }, // Media category
    created_at: { type: Date, default: Date.now }, // Creation date
    updated_at: { type: Date, default: Date.now } // Last update date
});

const LandMedia = mongoose.model("LandMedia", landMediaSchema);
module.exports = LandMedia;
