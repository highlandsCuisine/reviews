const { checkSchema } = require("express-validator");

// Restaurant Registration validation
exports.restaurantValidator = checkSchema({
  name: {
    exists: {
      errorMessage: "Restaurant Name is required.",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "Restaurant Name should be string." },
    isLength: {
      options: { min: 3, max: 24 },
      errorMessage: "Restaurant Name should be between 3-24 characters.",
    },
  },
  link: {
    exists: {
      errorMessage: "Restaurant link is required.",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "Restaurant link should be string." },
    isLength: {
      options: { min: 8 },
      errorMessage: "Restaurant link should have at least 8 characters.",
    },
  },
});
