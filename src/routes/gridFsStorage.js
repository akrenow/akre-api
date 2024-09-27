const crypto = require("crypto");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
// MongoDB URI
const mongoURI = process.env.DB_URI;

// Create storage engine for GridFS
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Generate a random filename
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads", // The collection name in GridFS
        };
        resolve(fileInfo);
      });
    });
  },
});

// Configure multer with GridFS storage
const upload = multer({ storage });

module.exports = upload;
