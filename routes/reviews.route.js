const express = require("express");
const {
  getReviewByID,
  updateReviewsByID,
} = require("../controller/review.controller");
const router = express.Router();

router.get("/get/:id", getReviewByID);
router.post("/update", updateReviewsByID);

module.exports = router;
