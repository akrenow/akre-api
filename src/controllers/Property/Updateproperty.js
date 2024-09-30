const Property = require("../../Models/Property");
 const updateproperties= async (req, res) => {
   try {
     const property = await Property.findByIdAndUpdate(
       req.params.id,
       req.body,
       {
         new: true,
       }
     );
     if (!property) {
       return res.status(404).json({ message: "Property not found" });
     }
     res.json(property);
   } catch (err) {
     res.status(400).json({ error: err.message });
   }
 };
 module.exports=updateproperties;