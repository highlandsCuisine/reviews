const express = require("express");
const { healthCheck } = require("../controller/healthCheck");
const router = express.Router();
router.get("/", healthCheck);
module.exports = router;
