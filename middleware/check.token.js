const { verifyToken } = require("../helper/jwt.function");

exports.checkToken = async (req, res, next) => {
  const reqToken = await req.session.user;

  if (!reqToken) {
    return res.redirect("/admin/dvls/googlereviews/login");
  }
  const decode = await verifyToken(reqToken);
  if (!decode) {
    await req.session.destroy();
    await res.clearCookie("_login_info");
    await res.clearCookie("x-csrf-token");
    await res.clearCookie("__host-x-csrf-token");
    return res.redirect("/admin/dvls/googlereviews/login");
  }
  return next();
};
