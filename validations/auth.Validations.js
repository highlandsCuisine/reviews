const { checkSchema } = require("express-validator");

// User Registration validation
exports.userRegisterValidator = checkSchema({
  name: {
    exists: {
      errorMessage: "UserName is required.",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "UserName should be string." },
    isLength: {
      options: { min: 3, max: 24 },
      errorMessage: "UserName should be between 3-24 characters.",
    },
  },
  email: {
    isEmail: { errorMessage: "Please provide valid email." },
  },
  password: {
    exists: { errorMessage: "Password is required." },
    isString: { errorMessage: "Password should be string." },
    isStrongPassword: { errorMessage: "System has detected weak password." },
    isLength: {
      options: { min: 8, max: 50 },
      errorMessage: "Password should be between 8-50 characters.",
    },
  },
});

// User Login validation
exports.userLoginValidator = checkSchema({
  email: {
    isEmail: { errorMessage: "Please provide valid email." },
  },
  password: {
    exists: { errorMessage: "Password is required." },
    isString: { errorMessage: "Password should be string." },
    isLength: {
      options: { min: 8, max: 50 },
      errorMessage: "Password should be between 8-50 characters.",
    },
  },
});

//forgot password validations
exports.forgotPassValidator = checkSchema({
  email: {
    isEmail: { errorMessage: "Please provide valid email." },
  },
});

exports.newPasswordValidator = checkSchema({
  email: {
    isEmail: { errorMessage: "Please provide valid email." },
  },
  password: {
    exists: { errorMessage: "Password is required." },
    isString: { errorMessage: "Password should be string." },
    isStrongPassword: { errorMessage: "System has detected weak password." },
    isLength: {
      options: { min: 8, max: 50 },
      errorMessage: "Password should be between 8-50 characters.",
    },
  },
  password1: {
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match.");
        }
        return true;
      },
    },
  },
});
