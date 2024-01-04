const { trycatch } = require("../helper/tryCatch");
const { ErrorHandler } = require("../helper/errorHandler");
const { acceptingMedia } = require("../config/allowedMedia");

const checkContentType = trycatch(async (req, res, next) => {
  const contentType = await req.headers["content-type"];
  if (
    (await (req.method !== "GET")) &&
    contentType &&
    !acceptingMedia.some((allowedType) => contentType.includes(allowedType))
  ) {
    return next(new ErrorHandler(415));
  }

  return next();
});

module.exports = { checkContentType };
