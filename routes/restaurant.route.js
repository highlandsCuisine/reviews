const express = require("express");
const {
  addRestaurant,
  getRestaurant,
  deleteRestaurant,
} = require("../controller/restaurant.controller");
const { checkToken } = require("../middleware/check.token");
const {
  restaurantValidator,
} = require("../validations/restaurant.validations");
const {
  doubleCsrfProtection,
  csrfErrorHandler,
} = require("../helper/csrf.csrf");
const router = express.Router();

router.post(
  "/add",
  doubleCsrfProtection,
  csrfErrorHandler,
  checkToken,
  restaurantValidator,
  addRestaurant
);
router.get("/get", checkToken, getRestaurant);
router.get("/delete/:id", checkToken, deleteRestaurant);

module.exports = router;
