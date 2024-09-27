const express = require("express");
const router = express.Router();
const Property = require("../Models/Property");
const upload = require("./gridFsStorage"); // Import GridFS storage setup

// Create a new property
router.post("/properties", async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all properties
router.get("/properties", async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a property by ID
router.get("/properties/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a property
router.put("/properties/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a property
router.delete("/properties/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
