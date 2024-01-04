const express = require("express");
const {
  loginView,
  registerView,
  forgotPassView,
  dashboardView,
} = require("../controller/views.controller");
const { checkToken } = require("../middleware/check.token");
const router = express.Router();

router.get("/googlereviews/login", loginView);
router.get("/googlereviews/route/secret/register", registerView);
router.get("/googlereviews/forgotpass", forgotPassView);
router.get("/googlereviews/adminpannel", checkToken, dashboardView);

module.exports = router;
