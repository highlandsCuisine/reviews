const { ErrorHandler } = require("../helper/errorHandler");
const { getRestaurantData } = require("./restaurant.controller");

exports.loginView = async (req, res, next) => {
  res.render("login", {
    token: req.csrfToken(true),
  });
};

exports.registerView = async (req, res, next) => {
  res.render("register", {
    token: req.csrfToken(true),
  });
};

exports.forgotPassView = async (req, res, next) => {
  res.render("forgotpass", {
    token: req.csrfToken(true),
  });
};

exports.dashboardView = async (req, res, next) => {
  const data = await getRestaurantData();
  if (!data) {
    return new ErrorHandler(500);
  }
  res.render("index", {
    data,
    token: req.csrfToken(true),
  });
};
