const express = require("express");
const router = express.Router();
const Property = require("../Models/Property");
const upload = require("./gridFsStorage"); // Import GridFS storage setup
const getproperties = require("../controllers/Property/Getproperties");
const createproperty = require("../controllers/Property/createproperty");
const getpropertybyid = require("../controllers/Property/GetpropertybyID");
const updateproperties = require("../controllers/Property/Updateproperty");
const deleteproperty = require("../controllers/Property/deleteproperty");


// Create a new property
router.post("/properties",createproperty);

// Get all properties
router.get("/properties",getproperties);

// Get a property by ID
router.get("/properties/:id",getpropertybyid);

// Update a property
router.put("/properties/:id",updateproperties);

// Delete a property
router.delete("/properties/:id",deleteproperty);


// Route to get file (image/video) by filename
router.get("/file/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: "No file exists" });
    }

    // Check if file is an image or video
    if (
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png" ||
      file.contentType === "video/mp4"
    ) {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({ err: "Not an image or video file" });
    }
  });
});

// Route to upload images and videos
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  // Log the uploaded file details for debugging
  console.log(req.file);
  res.json({ file: req.file });
});

module.exports = router;
