const express = require("express");
const router = express.Router();
const Property = require("../Models/Property");
const upload = require("../helpers/gridFsStorage"); // Import GridFS storage setup
const getproperties = require("../controllers/Property/Getproperties");
const createproperty = require("../controllers/Property/createproperty");
const getpropertybyid = require("../controllers/Property/GetpropertybyID");
const updateproperties = require("../controllers/Property/Updateproperty");
const deleteproperty = require("../controllers/Property/deleteproperty");
const getfile = require("../controllers/Property/getfile");
const uploadfile = require("../controllers/Property/uploadfile");

// Create a new property
router.post("/properties", createproperty);

// Get all properties
router.get("/properties", getproperties);

// Get a property by ID
router.get("/properties/:id", getpropertybyid);

// Update a property
router.put("/properties/:id", updateproperties);

// Delete a property
router.delete("/properties/:id", deleteproperty);

// Route to get file (image/video) by filename
router.get("/file/:filename", getfile);

// Route to upload images and videos
router.post("/upload", upload.single("file"), uploadfile);

module.exports = router;
