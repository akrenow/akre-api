const Property = require("../../Models/Property");
const { SUCCESS_CODE, BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE } = require("../../utils/statusCodes");
const { PROPERTY_NOT_FOUND } = require("../../utils/strings");

const getAllProperties = async (req, res) => {
  try {
    // Extract query parameters for pagination and filtering
    const { page = 1, limit = 10, ...filters } = req.query;

    // Build query object based on filters
    const query = {};

    // Example: Filtering by property_type
    if (filters.property_type) {
      query.property_type = filters.property_type;
    }

    // Add more filters as needed (e.g., price range, location)

    // Fetch properties with pagination and populate related fields
    const properties = await Property.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('seller')
      .populate('land_media')
      .populate({
        path: 'division_info',
        populate: {
          path: 'parent_division',
          model: 'Division',
        },
      })
      .exec();

    // Get total count for pagination metadata
    const totalProperties = await Property.countDocuments(query);

    res.status(SUCCESS_CODE).json({
      success: true,
      data: properties,
      meta: {
        total: totalProperties,
        page: parseInt(page),
        pages: Math.ceil(totalProperties / limit),
      },
    });
  } catch (error) {
    res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ success: false, message: error.message });
  }
};

module.exports = getAllProperties;
