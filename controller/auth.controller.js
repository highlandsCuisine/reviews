const ejs = require("ejs");
const authenticService = require("../services/auth.service");
const { signToken } = require("../helper/jwt.function");
const { ErrorHandler } = require("../helper/errorHandler");
const { trycatch } = require("../helper/tryCatch");
const { validationResult } = require("express-validator");
const {
  generateToken,
  generateLink,
  generateUserLink,
} = require("../helper/link.generator");
const sendEmail = require("../helper/sendEmail");

exports.authentic = trycatch(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const e = errors.mapped();
    return next(
      new ErrorHandler(
        400,
        `${e.email ? e.email.msg : ""}\n${e.password ? e.password.msg : ""}`
      )
    );
  }
  const { email, password } = await req.body;
  authenticService
    .authentic({ email: email, password: password })
    .then(async (data) => {
      if (data) {
        const token = signToken(data[0].name);
        req.session.user = token;
        res.status(200).json({
          success: true,
          message: "Welcome back! Login Success!",
        });
      }
    })
    .catch((err) => {
      return next(new ErrorHandler(500, err.message));
    });
});

exports.signup = trycatch(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const e = errors.mapped();
    return next(
      new ErrorHandler(
        400,
        `${e.name ? e.name.msg : ""}\n${e.email ? e.email.msg : ""}\n${
          e.password ? e.password.msg : ""
        }`
      )
    );
  }
  const { name, email, password } = await req.body;
  const accessable = email.split("@")[1];
  if (accessable !== "mydvls.com") {
    return next(new ErrorHandler(403, "You are not a member of our company!"));
  }
  const token = generateToken(24);
  authenticService
    .signup({ name: name, email: email, password: password }, token)
    .then(async (data) => {
      if (data) {
        const Link = generateUserLink(token, data.insertId);
        const datas = await ejs.renderFile("views/email/verifyLink.ejs", {
          Link,
          email,
        });
        sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: "Account Request!",
          html: datas,
        });
        res.status(200).json({
          success: true,
          message: "User Signup successful",
          info: data.info,
        });
      }
    })
    .catch((err) => {
      return next(new ErrorHandler(500, err.message));
    });
});

exports.forgotPass = trycatch(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const e = errors.mapped();
    return next(new ErrorHandler(400, `${e.email ? e.email.msg : ""}`));
  }
  const { email } = await req.body;
  const token = generateToken(22);
  authenticService
    .getforgotPass({ email: email }, token)
    .then(async (data) => {
      if (data) {
        const resetPasswordLink = generateLink(token, data.insertId);
        const datas = await ejs.renderFile("views/email/passwordReset.ejs", {
          resetPasswordLink,
        });
        sendEmail({
          to: email,
          subject: "Reset Password",
          html: datas,
        });
        res.status(200).json({
          success: true,
          message: "Please check your email !",
          info: data.info,
        });
      }
    })
    .catch((err) => {
      return next(new ErrorHandler(500, err.message));
    });
});

exports.authorizeToken = trycatch(async (req, res, next) => {
  const { token, id } = await req.query;
  authenticService
    .forgotPass(id, token)
    .then((da) => {
      if (da) {
        res.render("resetForm", {
          token: req.csrfToken(true),
          email: da[0].email,
        });
      }
    })
    .catch((err) => {
      return next(new ErrorHandler(500, err.message));
    });
});

exports.authorizeUser = trycatch(async (req, res, next) => {
  const { token, id } = await req.query;
  authenticService
    .verifyUser(id, token)
    .then((da) => {
      if (da) {
        res.render("verified");
      }
    })
    .catch((err) => {
      return next(new ErrorHandler(500, err.message));
    });
});

exports.newPassword = trycatch(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const e = errors.mapped();
    return next(
      new ErrorHandler(
        400,
        `${e.email ? e.email.msg : ""}\n${e.password ? e.password.msg : ""}\n${
          e.password1 ? e.password1.msg : ""
        }\n`
      )
    );
  }
  const { email, password } = await req.body;

  authenticService
    .newPassword({ email: email, password: password })
    .then(async (data) => {
      if (data) {
        const datas = await ejs.renderFile("views/email/resetInfo.ejs", {
          email,
        });
        sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: "Password Changed by user",
          html: datas,
        });
        res.status(200).json({
          success: true,
          message: "Password reset successful !",
          info: data.info,
        });
      }
    })
    .catch((err) => {
      return next(new ErrorHandler(500, err.message));
    });
});

exports.signOutUser = trycatch(async (req, res, next) => {
  await req.session.destroy();
  await res.clearCookie("_login_info");
  await res.clearCookie("x-csrf-token");
  await res.clearCookie("__host-x-csrf-token");
  return res.redirect("/admin/dvls/googlereviews/login");
});
