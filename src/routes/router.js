const express = require("express");
const userRouter = require("./usersRouter");
const propertyRouter = require("./propertyRouter");
const mediaRouter = require("./mediaRouter");
const router = express.Router();

router.get("/api/", (req, res) => {
  res.send(`${process.env.NODE_ENV}, Welcome! The backend is UP.`);
});

//Auth and User Route
router.use("/api/users", userRouter);

// Property routes
router.use("/api/properties", propertyRouter);

//Media Routes
router.use("/api/media", mediaRouter);

module.exports = router;
