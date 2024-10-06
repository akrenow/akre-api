const Property = require("../../Models/Property");
const LandMedia = require("../../Models/LandMedia");
const Seller = require("../../Models/Seller");
const Division = require("../../Models/Division");
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
  if (!token) {
    return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Token is required." });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params; // Property ID from the URL
    const { seller, land_media, division_info, ...updatedFields } = req.body;

    // Check required fields
    if (!id) {
      return res.status(BAD_REQUEST_CODE).json({ success: false, message: "Property ID is required." });
    }

    // Find the property by ID
    const property = await Property.findById(id);
    if (!property) {
      return res.status(NOT_FOUND_CODE).json({ success: false, message: PROPERTY_NOT_FOUND });
    }

    // If seller info is provided, update or create
    let sellerId;
    if (seller) {
      const existingSeller = await Seller.findOne({ user_id: seller.user_id });
      if (existingSeller) {
        // Update existing seller
        if (updatedFields.property_type === "land") {
          existingSeller.total_lands_count += 1;
        } else if (updatedFields.property_type === "plot") {
          existingSeller.total_plots_count += 1;
        }
        await existingSeller.save();
        sellerId = existingSeller._id;
      } else {
        // Create new seller if not found
        const newSeller = new Seller(seller);
        await newSeller.save();
        sellerId = newSeller._id;
      }
    }

    // Handle land media updates if provided
    if (land_media) {
      // Update land media: first delete old media records associated with the property
      await LandMedia.deleteMany({ property_id: property._id });

      // Create new land media records
      const newLandMediaRecords = land_media.map(media => new LandMedia({ ...media, property_id: property._id }));
      await LandMedia.insertMany(newLandMediaRecords);
      
      // Update the property with new land media IDs
      property.land_media = newLandMediaRecords.map(media => media._id);
    }

    // Update or create division hierarchy if provided
    const divisionRecords = [];
    if (division_info) {
      let parentDivision = null;

      for (const division of division_info) {
        // Check if this division already exists in the database
        let existingDivision = await Division.findOne({
          name: division.name,
          division_type: division.division_type,
        });

        if (!existingDivision) {
          // If division doesn't exist, create a new one
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
    }

    // Update the property with dynamic data
    property.set({
      ...updatedFields,
      seller: sellerId || property.seller, // Use existing seller if not provided
      division_info: divisionRecords.length ? divisionRecords : property.division_info, // Save the division hierarchy
    });

    await property.save();

    res.status(SUCCESS_CODE).json({ success: true, message: PROPERTY_UPDATED_SUCCESS, data: property });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR_CODE).json({ success: false, message: error.message });
  }
};

module.exports = updatePropertyController;
