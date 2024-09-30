const Property = require("../../Models/Property");
const getproperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = getproperties;
