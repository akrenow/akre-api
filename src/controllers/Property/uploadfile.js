const uploadfile = (req, res) => {
  // Log the uploaded file for debugging
  console.log("File:", req.file);
  console.log("Uploaded File:", req.file); // Check if file is present
  uploadfile(req, res);

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  // If the upload is successful, send back the file info
  res.status(200).json({
    message: "File uploaded successfully.",
    file: {
      id: req.file.id,
      filename: req.file.filename,
      contentType: req.file.contentType,
      uploadDate: req.file.uploadDate,
      size: req.file.size,
    },
  });
};

module.exports = uploadfile;
