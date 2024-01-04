const { acceptingHost } = require("../config/allowedHost");

exports.corsOptionsDelegate = {
  origin: acceptingHost,
  credentials: true,
};
