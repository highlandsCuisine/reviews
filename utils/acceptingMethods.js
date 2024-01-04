const acceptingmethods = require("../config/allowedMethods");
const { ErrorHandler } = require("../helper/errorHandler");

const allowedMethods = (req, res, next) => {
  if (!acceptingmethods.includes(req.method)) {
    return next(new ErrorHandler(405));
  }
  return next();
};

module.exports = { allowedMethods };
