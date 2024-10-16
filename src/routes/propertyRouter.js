const express = require("express");
const createPropertyController = require("../controllers/Property/create");
const getAllProperties = require("../controllers/Property/getProperty");
const deletePropertyController = require("../controllers/Property/delete");
const updatePropertyController = require("../controllers/Property/update");
const upload = require("../middleware/upload");

const propertyRouter = express.Router();

propertyRouter.post("/", upload.array("media", 10), createPropertyController); // Up to 10 files can be uploaded

propertyRouter.get("/", getAllProperties);

// Update an existing property
propertyRouter.put("/:id", updatePropertyController);

// Delete a property
propertyRouter.delete("/:id", deletePropertyController);

module.exports = propertyRouter;
