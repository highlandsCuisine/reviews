const sanitizer = require("perfect-express-sanitizer");
const whiteList = ["/api/v1/res/add", "/api/v1/reviews/update"];
exports.sanitize = sanitizer.clean(
  {
    noSql: true,
    sql: true,
  },
  whiteList,
  (only = ["body", "query"])
);
