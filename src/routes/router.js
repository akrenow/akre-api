const express = require("express");
const script = require("../controllers/script");
const userRouter = require("./usersRouter");
const router = express.Router();

router.get("/api/", (req, res) => {
  res.send(`${process.env.NODE_ENV}, Welcome! The backend is UP.`);
});
router.post("/api/script", script);

// Add users route
router.use("/api/users", userRouter);

module.exports = router;
