const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const storage = new GridFsStorage({
  url: process.env.DB_URI,
  file: (req, file) => {
    const mimeType = file.mimetype.startsWith("image/") ? "image" : "video";
    return {
      filename: file.originalname,
      bucketName: "uploads",
      metadata: { originalname: file.originalname, media_type: mimeType },
      id: new mongoose.Types.ObjectId(),
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
