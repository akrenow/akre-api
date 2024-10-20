const Property = require("../../Models/Property");
const Seller = require("../../Models/Seller");
const Division = require("../../Models/Division");
const {
  SUCCESS_CODE,
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  UNAUTHORIZED_CODE,
} = require("../../utils/statusCodes");
const {
  PROPERTY_CREATED_SUCCESS,
  MISSING_REQUIRED_FIELDS,
  INVALID_OR_EXPIRED_TOKEN,
  INVALID_INPUT_DATA,
  INTERNAL_SERVER_ERROR,
} = require("../../utils/strings");
const jwt = require("jsonwebtoken");

const createPropertyController = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Check if token exists
  if (!token) {
    return res
      .status(UNAUTHORIZED_CODE)
      .json({ success: false, message: INVALID_OR_EXPIRED_TOKEN });
  }

  try {
    // Verify the token (catch JWT errors if any)
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(UNAUTHORIZED_CODE)
        .json({ success: false, message: INVALID_TOKEN });
    }

    const {
      property_type,
      price_per_acre,
      total_price,
      seller,
      division_info,
      ...otherFields
    } = req.body;

    // Check if all required fields are provided
    if (
      !price_per_acre ||
      !total_price ||
      !seller ||
      !division_info ||
      !property_type
    ) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: MISSING_REQUIRED_FIELDS });
    }

    let sellerId;
    try {
      const existingSeller = await Seller.findOne({ user_id: seller.user_id });
      if (existingSeller) {
        existingSeller.total_lands_count += property_type === "land" ? 1 : 0;
        existingSeller.total_plots_count += property_type === "plot" ? 1 : 0;
        await existingSeller.save();
        sellerId = existingSeller._id;
      } else {
        const newSeller = new Seller(seller);
        newSeller.total_lands_count += property_type === "land" ? 1 : 0;
        newSeller.total_plots_count += property_type === "plot" ? 1 : 0;
        await newSeller.save();
        sellerId = newSeller._id;
      }
    } catch (err) {
      console.error("Seller save error: ", err);
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .json({ success: false, message: "Failed to process seller data." });
    }

    let mediaRecords = [];
    if (req.files && Array.isArray(req.files)) {
      try {
        mediaRecords = req.files.map((file) => ({
          media_type: file.mimetype.startsWith("image/") ? "image" : "video",
          file_id: file.id, // GridFS file ID
          filename: file.originalname,
        }));
      } catch (err) {
        console.error("Media processing error: ", err);
        return res
          .status(BAD_REQUEST_CODE)
          .json({ success: false, message: "Invalid media files." });
      }
    } else {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: "No media files uploaded." });
    }

    // Handle division info (ensure valid division information)
    let divisionRecords;
    try {
      divisionRecords = await Promise.all(
        division_info.map(async (division) => {
          let existingDivision = await Division.findOne({
            name: division.name,
            division_type: division.division_type,
          });
          if (!existingDivision) {
            const newDivision = new Division(division);
            await newDivision.save();
            existingDivision = newDivision;
          }
          return existingDivision._id;
        })
      );
    } catch (err) {
      console.error("Division info error: ", err);
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .json({ success: false, message: "Failed to process division info." });
    }

    // Create property

    const property = new Property({
      property_type,
      price_per_acre,
      total_price,
      seller: sellerId,
      media: mediaRecords,
      division_info: divisionRecords,
      ...otherFields,
    });
    await property.save();

    return res.status(SUCCESS_CODE).json({
      success: true,
      message: PROPERTY_CREATED_SUCCESS,
      data: property,
    });
  } catch (err) {
    console.error("Unexpected error: ", err);
    if (err.name === "ValidationError") {
      const errors = Object.keys(err.errors).map(
        (key) => err.errors[key].message
      );
      return res
        .status(BAD_REQUEST_CODE)
        .json({ success: false, message: errors });
    }
    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ success: false, message: INTERNAL_SERVER_ERROR });
  }
};

module.exports = createPropertyController;
