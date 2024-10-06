const Property = require("../../Models/Property");
const Seller = require("../../Models/Seller");
const LandMedia = require("../../Models/LandMedia");
const Division = require("../../Models/Division");
const { SUCCESS_CODE, BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE } = require("../../utils/statusCodes");
const { PROPERTY_CREATED_SUCCESS, MISSING_REQUIRED_FIELDS } = require("../../utils/strings");
const jwt = require("jsonwebtoken");
const createPropertyController = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Token is required." });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    const { property_type, price_per_acre, total_price, seller, land_media, division_info, ...otherFields } = req.body;

    // Check required fields
    if (!price_per_acre || !total_price || !seller || !land_media || !division_info || !property_type) {
      return res.status(BAD_REQUEST_CODE).json({ success: false, message: MISSING_REQUIRED_FIELDS });
    }

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

    // Create land media records
    const landMediaRecords = land_media.map(media => new LandMedia({ ...media, property_id: null }));
    await LandMedia.insertMany(landMediaRecords);

    // Create or retrieve division hierarchy
    const divisionRecords = [];
    let parentDivision = null;

    for (const division of division_info) {
      // Check if this division already exists in the database
      let existingDivision = await Division.findOne({
        name: division.name,
        division_type: division.division_type
      });

      if (!existingDivision) {
        // If division doesn't exist, create a new one
        const newDivision = new Division({
          ...division,
          parent_division: parentDivision ? parentDivision._id : null // Set parent division if exists
        });
        await newDivision.save();
        existingDivision = newDivision;
      }

      // Set the current division as the parent for the next in the hierarchy
      parentDivision = existingDivision;

      // Push the created or found division's ID into the divisionRecords array
      divisionRecords.push(existingDivision._id);
    }

    // Create the property with related data
    const property = new Property({
      price_per_acre,
      total_price,
      seller: sellerId,
      land_media: landMediaRecords.map(lm => lm._id),
      division_info: divisionRecords,  // Save the division hierarchy
      ...otherFields,
    });
    await property.save();

    // Update property_id in LandMedia
    await LandMedia.updateMany(
      { _id: { $in: landMediaRecords.map(lm => lm._id) } },
      { property_id: property._id }
    );

    res.status(SUCCESS_CODE).json({ success: true, message: PROPERTY_CREATED_SUCCESS, data: property });
  } catch (error) {
    console.log(error);
    
    res.status(INTERNAL_SERVER_ERROR_CODE).json({ success: false, message: error.message });
  }
};
module.exports = createPropertyController;
