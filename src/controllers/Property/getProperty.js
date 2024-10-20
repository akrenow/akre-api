const Property = require("../../Models/Property");
const {
  SUCCESS_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../../utils/statusCodes");

const getAllProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const query = {};

    // Apply filters if needed
    if (filters.property_type) query.property_type = filters.property_type;

    // Fetch properties with pagination and populate seller and division info
    const properties = await Property.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("seller")
      .populate("division_info")
      .populate("media") 
      .exec();

    const totalProperties = await Property.countDocuments(query);

    // Map through each property and transform the media field into an array of URLs
    const transformedProperties = properties.map((property) => {
      // Transform property into a plain JavaScript object
      const propertyObject = property.toObject();

      // Group media files into an array with their accessible URLs
      propertyObject.media = propertyObject.media.map((media) => ({
        ...media,
        url: `/api/media/${media.file_id}`, // Access URL for the media
      }));

      return propertyObject;
    });

    // Send the response with the transformed properties and meta data
    return res.status(SUCCESS_CODE).json({
      success: true,
      data: transformedProperties,
      meta: {
        total: totalProperties,
        page: parseInt(page),
        pages: Math.ceil(totalProperties / limit),
      },
    });
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ success: false, message: error.message });
  }
};

module.exports = getAllProperties;
