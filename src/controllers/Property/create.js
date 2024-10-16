const Property = require("../../Models/Property");
const Seller = require("../../Models/Seller");
const LandMedia = require("../../Models/LandMedia");
const Division = require("../../Models/Division");
const { SUCCESS_CODE, BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE } = require("../../utils/statusCodes");
const { PROPERTY_CREATED_SUCCESS, MISSING_REQUIRED_FIELDS } = require("../../utils/strings");
const jwt = require("jsonwebtoken");
const { gfs } = require("../../databaseconfig/databaseconnection");

const createPropertyController = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Token is required." });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    const { property_type, price_per_acre, total_price, seller, division_info, ...otherFields } = req.body;

    // Check required fields
    if (!price_per_acre || !total_price || !seller || !division_info || !property_type) {
      return res.status(BAD_REQUEST_CODE).json({ success: false, message: MISSING_REQUIRED_FIELDS });
    }

    // Handle seller logic
    const existingSeller = await Seller.findOne({ user_id: seller.user_id });
    let sellerId;
    if (existingSeller) {
      if (property_type === "land") {
        existingSeller.total_lands_count += 1;
      } else if (property_type === "plot") {
        existingSeller.total_plots_count += 1;
      }
      await existingSeller.save();
      sellerId = existingSeller._id;
    } else {
      const newSeller = new Seller(seller);
      await newSeller.save();
      sellerId = newSeller._id;
    }

    // Handle land media uploads (if any files are uploaded)
    let landMediaRecords = [];
    if (req.files && req.files.length > 0) {
      landMediaRecords = req.files.map((file) => new LandMedia({
        media_type: file.mimetype.startsWith("image/") ? "image" : "video",
        image: file.id, // GridFS file id
        category: file.mimetype.startsWith("image/") ? "image" : "video",
      }));
      await LandMedia.insertMany(landMediaRecords);
    }

    // Create or retrieve division hierarchy
    const divisionRecords = [];
    let parentDivision = null;

    for (const division of division_info) {
      let existingDivision = await Division.findOne({
        name: division.name,
        division_type: division.division_type,
      });

      if (!existingDivision) {
        const newDivision = new Division({
          ...division,
          parent_division: parentDivision ? parentDivision._id : null,
        });
        await newDivision.save();
        existingDivision = newDivision;
      }

      parentDivision = existingDivision;
      divisionRecords.push(existingDivision._id);
    }

    // Create the property with related data
    const property = new Property({
      price_per_acre,
      total_price,
      seller: sellerId,
      land_media: landMediaRecords.map((lm) => lm._id),
      division_info: divisionRecords,
      ...otherFields,
    });
    await property.save();

    // Update property_id in LandMedia
    await LandMedia.updateMany(
      { _id: { $in: landMediaRecords.map((lm) => lm._id) } },
      { property_id: property._id }
    );

    res.status(SUCCESS_CODE).json({ success: true, message: PROPERTY_CREATED_SUCCESS, data: property });
  } catch (error) {
    console.log(error);
    res.status(INTERNAL_SERVER_ERROR_CODE).json({ success: false, message: error.message });
  }
};

module.exports = createPropertyController;
