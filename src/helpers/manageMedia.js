const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

const deleteMediaFiles = async (mediaIds) => {
  // Ensure database connection
  const gfs = Grid(connection.db, mongoose.mongo);

  for (const id of mediaIds) {
    try {
      // Use GridFS to delete the file by ID
      await gfs.remove({ _id: id, root: "uploads" });
      console.log(`Deleted media file with ID: ${id}`);
    } catch (error) {
      console.error(
        `Failed to delete media file with ID ${id}:`,
        error.message
      );
    }
  }
};

module.exports = { deleteMediaFiles };
