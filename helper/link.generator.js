const crypto = require("crypto");

exports.generateToken = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
};

exports.generateUserLink = (token, id) => {
  const link = `${process.env.BACKEND_URL}api/v1/auth/user/userverify?token=${token}&&id=${id}`;
  return link;
};

exports.generateLink = (token, id) => {
  const link = `${process.env.BACKEND_URL}api/v1/auth/user/forgotpasslink?token=${token}&&id=${id}`;
  return link;
};
