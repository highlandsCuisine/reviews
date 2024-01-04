const jwt = require("jsonwebtoken");

exports.signToken = (data) => {
  const token = jwt.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: 3540000,
  });
  return token;
};

exports.verifyToken = (token) => {
  const isValid = jwt.verify(token, process.env.JWT_SECRET);
  return isValid;
};
