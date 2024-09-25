const express = require("express");
const script = require("../controllers/script");
const router = express.Router();

router.get("/api/", (req, res) => {
  res.send(`${process.env.NODE_ENV}, Welcome! The backend is UP.`);
});
router.post("/api/script", script);

module.exports = router;
//akre
