const mongoose = require("mongoose");

const getFile = async (req, res) => {
  const { fileId } = req.params;

  // Start the timer to measure performance
  console.time("getFileRequest");

  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    const file = await bucket
      .find({ _id: new mongoose.Types.ObjectId(fileId) })
      .toArray();

    if (!file || file.length === 0) {
      console.timeEnd("getFileRequest");
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    const fileSize = file[0].length;
    const range = req.headers.range;

    // Set cache headers to improve performance
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    if (!range) {
      res.setHeader("Content-Type", file[0].contentType);

      console.timeEnd("getFileRequest");

      // Stream the file
      return bucket
        .openDownloadStream(new mongoose.Types.ObjectId(fileId))
        .pipe(res);
    }

    // Handle range requests
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    // Set range headers
    res.status(206).set({
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": file[0].contentType,
      "Cache-Control": "public, max-age=31536000, immutable", // Cache control for range requests
    });

    console.timeEnd("getFileRequest");

    bucket
      .openDownloadStream(new mongoose.Types.ObjectId(fileId), { start, end })
      .pipe(res);
  } catch (error) {
    console.timeEnd("getFileRequest");
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = getFile;
