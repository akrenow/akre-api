const multer = require("multer");
const { GridFsStorage } = require('multer-gridfs-storage');
const dotenv = require("dotenv");

dotenv.config();

const storage = new GridFsStorage({
    url: process.env.DB_URI,
    file: (req, file) => {
      return {
        filename: file.originalname,
        bucketName: 'uploads',
      };
    }
  });
  

const upload = multer({ storage });

module.exports = upload;
