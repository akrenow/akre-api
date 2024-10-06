const express = require("express");
const createPropertyController = require("../controllers/Property/create");
const getAllProperties = require("../controllers/Property/getProperty");
const deletePropertyController = require("../controllers/Property/delete");
const updatePropertyController = require("../controllers/Property/update");


const propertyRouter = express.Router();

// Create a new property
propertyRouter.post("/", createPropertyController);

propertyRouter.get("/", getAllProperties);

// Update an existing property
propertyRouter.put("/:id", updatePropertyController);

// Delete a property
propertyRouter.delete("/:id", deletePropertyController);

module.exports = propertyRouter;
