const express = require("express");
const getFile = require("../controllers/media/getfile");

const mediaRouter = express.Router();

mediaRouter.get("/:fileId", getFile);

module.exports = mediaRouter;
