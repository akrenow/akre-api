const express = require("express");
const script = require("../controllers/script");
const userRouter = require("./usersRouter");
const router = express.Router();
const propertyRoutes = require("../routes/propertyRoutes");

router.get("/api/", (req, res) => {
  res.send(`${process.env.NODE_ENV}, Welcome! The backend is UP.`);
});

router.post("/api/script", script);

router.use("/api/users", userRouter);

//Property_Listing
router.use("/api/", propertyRoutes);

module.exports = router;
