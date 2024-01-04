const express = require("express");
const {
  signup,
  authentic,
  signOutUser,
  authorizeToken,
  newPassword,
  authorizeUser,
} = require("../controller/auth.controller");
const {
  userRegisterValidator,
  userLoginValidator,
  newPasswordValidator,
} = require("../validations/auth.Validations");
const {
  doubleCsrfProtection,
  csrfErrorHandler,
} = require("../helper/csrf.csrf");
const router = express.Router();

router.post(
  "/create",
  doubleCsrfProtection,
  csrfErrorHandler,
  userRegisterValidator,
  signup
);

router.post(
  "/login",
  doubleCsrfProtection,
  csrfErrorHandler,
  userLoginValidator,
  authentic
);

router.get("/forgotpasslink", authorizeToken);

router.get("/userverify", authorizeUser);

router.post(
  "/forgotpass",
  doubleCsrfProtection,
  csrfErrorHandler,
  newPasswordValidator,
  newPassword
);

router.get("/logout", signOutUser);

module.exports = router;
