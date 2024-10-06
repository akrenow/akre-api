const Property = require("../../Models/Property");
const LandMedia = require("../../Models/LandMedia");
const Seller = require("../../Models/Seller");
const {
  SUCCESS_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../../utils/statusCodes");
const {
  PROPERTY_DELETED_SUCCESS,
  PROPERTY_NOT_FOUND,
} = require("../../utils/strings");
const jwt = require("jsonwebtoken");

const deletePropertyController = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Token is required." });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    // Find the property by ID
    const property = await Property.findById(id);
    if (!property) {
      return res.status(NOT_FOUND_CODE).json({ success: false, message: PROPERTY_NOT_FOUND });
    }

    // Log the property ID for debugging
    console.log(`Deleting LandMedia associated with property ID: ${property._id}`);

    // Delete related land media
    await LandMedia.deleteMany({ property_id: property._id });

    // Update seller info if necessary
    const seller = await Seller.findById(property.seller);
    if (seller) {
      if (property.property_type === "land") {
        seller.total_lands_count = Math.max(seller.total_lands_count - 1, 0);
      } else if (property.property_type === "plot") {
        seller.total_plots_count = Math.max(seller.total_plots_count - 1, 0);
      }
      await seller.save();
    }

    // Delete the property
    await Property.findByIdAndDelete(id);

    res.status(SUCCESS_CODE).json({ success: true, message: PROPERTY_DELETED_SUCCESS });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR_CODE).json({ success: false, message: error.message });
  }
};

module.exports = deletePropertyController;
