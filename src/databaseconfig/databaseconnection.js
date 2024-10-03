const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

let gfs;

const db_connection = async () => {
  try {
    // Initiate connection to MongoDB
    await mongoose.connect(process.env.DB_URI, {}).then(() => {
      console.log("Database connected successfully.");
    });

    const db = mongoose.connection;

    // Handle MongoDB connection events
    db.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    db.on("disconnected", () => {
      console.log("MongoDB connection disconnected");
    });

    // Initialize GridFS when connection is open
    db.once("open", () => {
      gfs = Grid(db.db, mongoose.mongo);
      gfs.collection("uploads"); // Files will be stored in 'uploads' collection
      console.log("GridFS initialized");
    });
  } catch (err) {
    console.error(
      "An error occurred during the MongoDB connection setup:",
      err
    );
  }
};

// Gracefully handle shutdown and close MongoDB connection
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to application termination");
  process.exit(0);
});

module.exports = { db_connection, gfs };
