const Property = require("../../Models/Property");

const getfile = (req, res) => {
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
};

module.exports = getfile;
