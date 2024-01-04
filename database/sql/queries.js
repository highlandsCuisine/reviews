exports.userQuery = {
  authenticQuery: "SELECT * FROM user WHERE email = ?",
  signupQuery: "INSERT INTO user(name,email,password)VALUES(? , ?, ?)",
  resetPassword: "UPDATE user SET password = ? WHERE email = ?",
  verifyUser: "UPDATE user SET isVerified = true WHERE email = ?",
};

exports.tokenQuery = {
  forgotPass: "INSERT INTO tokens(reset_token,expires,email)VALUES(? , ? , ?)",
  checkIfPresent: "SELECT * FROM tokens WHERE tid=?",
  deleteTokens: "DELETE FROM tokens WHERE email = ?",
  deleteExpiredTokens: "DELETE FROM tokens WHERE tid = ?",
  deleteExpiresTtl: "DELETE FROM tokens WHERE expires < NOW()",
};

exports.userVerifyQuery = {
  userPass: "INSERT INTO userverify(user_token,expires,email)VALUES(? , ? , ?)",
  checkIfPresent: "SELECT * FROM userverify WHERE uid=?",
  deleteTokens: "DELETE FROM userverify WHERE email = ?",
  deleteExpiredTokens: "DELETE FROM userverify WHERE uid = ?",
  deleteExpiresTtl: "DELETE FROM userverify WHERE expires < NOW()",
};

exports.restaurantQuery = {
  addrestaurantQuery: "INSERT INTO restaurant(name,link)VALUES(? ,?)",
  getrestaurantQuery: "SELECT * FROM restaurant;",
  deleterestaurantQuery: "DELETE FROM restaurant WHERE rid = ?",
};

exports.reviewQuery = {
  addreviewQuery:
    "INSERT INTO review(author_name,author_url,profile_photo_url,text,rating,rid)VALUES ?",
  getreviewbyidQuery: "SELECT * FROM review WHERE rid = ?",
  deletereviewQuery: "DELETE FROM review WHERE rid = ?",
};
