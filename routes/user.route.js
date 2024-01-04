const express = require("express");
const { forgotPass } = require("../controller/auth.controller");
const { forgotPassValidator } = require("../validations/auth.Validations");
const {
  doubleCsrfProtection,
  csrfErrorHandler,
} = require("../helper/csrf.csrf");

const router = express.Router();

router.post(
  "/reset/password",
  doubleCsrfProtection,
  csrfErrorHandler,
  forgotPassValidator,
  forgotPass
);

module.exports = router;
