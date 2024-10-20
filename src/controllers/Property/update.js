const Property = require("../../Models/Property");
const Seller = require("../../Models/Seller");
const {
  SUCCESS_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../../utils/statusCodes");
const {
  PROPERTY_UPDATED_SUCCESS,
  PROPERTY_NOT_FOUND,
  MISSING_REQUIRED_FIELDS,
} = require("../../utils/strings");
const jwt = require("jsonwebtoken");

const updatePropertyController = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Check if token exists
  if (!token) {
    return res
      .status(BAD_REQUEST_CODE)
      .json({ success: false, message: "Token is required." });
  }

  try {
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    // Find the property by ID
    const property = await Property.findById(id);
    if (!property) {
      return res.status(NOT_FOUND_CODE).json({ success: false, message: PROPERTY_NOT_FOUND });
    }

    const {
      property_type,
      price_per_acre,
      total_price,
      media,
      division_info,
      ...otherFields
    } = req.body;

    // Check for required fields
    if (!price_per_acre || !total_price || !property_type) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: MISSING_REQUIRED_FIELDS });
    }

    // Update seller info if necessary
    const seller = await Seller.findById(property.seller);
    if (seller) {
      if (property.property_type === "land" && property_type !== "land") {
        seller.total_lands_count = Math.max(seller.total_lands_count - 1, 0);
      } else if (property.property_type === "plot" && property_type !== "plot") {
        seller.total_plots_count = Math.max(seller.total_plots_count - 1, 0);
      }
      if (property_type === "land") {
        seller.total_lands_count += 1;
      } else if (property_type === "plot") {
        seller.total_plots_count += 1;
      }
      await seller.save();
    }

    // Update the property
    property.property_type = property_type;
    property.price_per_acre = price_per_acre;
    property.total_price = total_price;
    property.media = media || property.media; // Keep existing media if not updated
    property.division_info = division_info || property.division_info; // Keep existing divisions if not updated
    Object.assign(property, otherFields);
    await property.save();

    return res.status(SUCCESS_CODE).json({
      success: true,
      message: PROPERTY_UPDATED_SUCCESS,
      data: property,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ success: false, message: error.message });
  }
};

module.exports = updatePropertyController;
