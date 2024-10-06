const mongoose = require("mongoose");

const divisionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }, // Name of the division (e.g., Karnataka, Bangalore, etc.)
  
  division_type: {
    type: String,
    enum: ["state", "district", "taluk", "hobli", "village"],
    required: true,
  }, // Type of division: state, district, taluk, hobli, village

  parent_division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Division", // Reference to the parent division
    default: null,   // The top-level division (state) will have no parent
  },
});

// Create a model based on the schema
const Division = mongoose.model("Division", divisionSchema);

module.exports = Division;
