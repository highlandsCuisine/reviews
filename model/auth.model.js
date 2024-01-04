const bcrypt = require("bcrypt");
var db = require("../database/connection");
var dbFunc = require("../database/db.function");
const {
  userQuery,
  tokenQuery,
  userVerifyQuery,
} = require("../database/sql/queries");

function authentic(authenticData) {
  return new Promise((resolve, reject) => {
    db.query(
      userQuery.authenticQuery,
      [authenticData.email],
      (error, rows, fields) => {
        if (error) {
          reject({ success: false, message: err });
        } else if (rows.length < 1) {
          reject({ success: false, message: "Please check your credentials!" });
        } else if (!rows[0].isVerified) {
          reject({
            success: false,
            message: "Please ask admin to verify you as user!",
          });
        } else {
          bcrypt.compare(
            authenticData.password,
            rows[0].password,
            function (err, isMatch) {
              if (err) {
                reject({ success: false, message: err });
              } else if (isMatch) {
                resolve(rows);
              } else {
                reject({ success: false, message: "Password doesnot match!" });
              }
            }
          );
        }
      }
    );
  });
}

function signup(user, token) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return reject(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return reject(err);
        }
        user.password = hash;
        db.query(
          userQuery.authenticQuery,
          [user.email],
          (error, rows, fields) => {
            if (error) {
              dbFunc.connectionRelease;
              reject(error);
            } else if (rows.length > 0) {
              console.log(rows);
              dbFunc.connectionRelease;
              reject({
                success: false,
                message:
                  "User already exist ! Try with different username and email !",
              });
            } else {
              db.query(
                userQuery.signupQuery,
                [user.name, user.email, user.password],
                (error, rows, fields) => {
                  if (error) {
                    dbFunc.connectionRelease;
                    reject(error);
                  } else {
                    dbFunc.connectionRelease;
                    bcrypt.hash(token, salt, function (err, hash) {
                      if (err) {
                        return reject(err);
                      }
                      db.query(
                        userVerifyQuery.userPass,
                        [
                          hash,
                          new Date(Date.now() + 24 * 60 * 60 * 1000),
                          user.email,
                        ],
                        (error, rows, fields) => {
                          if (error) {
                            dbFunc.connectionRelease;
                            reject({ success: false, message: error });
                          } else {
                            dbFunc.connectionRelease;
                            resolve(rows);
                          }
                        }
                      );
                    });
                  }
                }
              );
            }
          }
        );
      });
    });
  });
}

function getforgotPass(user, token) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(8, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(token, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        db.query(
          tokenQuery.forgotPass,
          [hash, new Date(Date.now() + 15 * 60 * 1000), user.email],
          (err, row, fields) => {
            if (err || row === undefined || row.length < 1) {
              reject({
                success: false,
                message: err
                  ? "Something went wrong! Are you a user?"
                  : "Please sign-up first!",
              });
            } else {
              resolve(row);
            }
          }
        );
      });
    });
  });
}

function forgotPass(id, token) {
  return new Promise((resolve, reject) => {
    db.query(tokenQuery.checkIfPresent, [id], (err, row, fields) => {
      if (err || row.length < 1) {
        reject({
          success: false,
          message: err ? err : "Link expired or Something went wrong!",
        });
      } else {
        bcrypt.compare(token, row[0].reset_token, function (err, isMatch) {
          if (err) {
            reject({ success: false, message: err });
          } else if (isMatch) {
            resolve(row);
          } else {
            reject({
              success: false,
              message: "Link expired or Invalid link !",
            });
          }
        });
      }
    });
  });
}

function verifyUser(id, token) {
  return new Promise((resolve, reject) => {
    db.query(userVerifyQuery.checkIfPresent, [id], (err, row, fields) => {
      if (err || row.length < 1) {
        reject({
          success: false,
          message: err ? err : "Link expired or Something went wrong!",
        });
      } else {
        bcrypt.compare(token, row[0].user_token, function (err, isMatch) {
          if (err) {
            reject({ success: false, message: err });
          } else if (isMatch) {
            db.query(
              userQuery.verifyUser,
              [row[0].email],
              function (err, user) {
                if (err) {
                  reject({ success: false, message: err });
                } else {
                  resolve({
                    success: true,
                    message:
                      "User is verified! Now he/she can view admin pannel!",
                  });
                }
              }
            );
          } else {
            reject({
              success: false,
              message: "Link expired or Invalid link !",
            });
          }
        });
      }
    });
  });
}

function newPassword(user) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return reject({
          success: false,
          message: err ? err : "Something went wrong !",
        });
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return reject({
            success: false,
            message: err ? err : "Something went wrong !",
          });
        }
        db.query(
          userQuery.authenticQuery,
          [user.email],
          (error, rows, fields) => {
            if (error || rows.length < 1) {
              dbFunc.connectionRelease;
              reject({
                success: false,
                message: error ? error : "User not exist !",
              });
            } else {
              bcrypt.compare(
                user.password,
                rows[0].password,
                function (err, isMatch) {
                  if (err) {
                    reject({ success: false, message: err });
                  } else if (isMatch) {
                    reject({
                      success: false,
                      message: "Old password can't be new password!",
                    });
                  } else {
                    db.query(
                      userQuery.resetPassword,
                      [hash, user.email],
                      (error, rows, fields) => {
                        if (error) {
                          dbFunc.connectionRelease;
                          reject({
                            success: false,
                            message: error,
                          });
                        } else {
                          db.query(
                            tokenQuery.deleteTokens,
                            [user.email],
                            (error, rows, fields) => {
                              if (error) {
                                dbFunc.connectionRelease;
                                reject({
                                  success: false,
                                  message: error,
                                });
                              } else {
                                dbFunc.connectionRelease;
                                resolve(rows);
                              }
                            }
                          );
                          // dbFunc.connectionRelease;
                          // resolve(rows);
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      });
    });
  });
}

function deleteExpiredTokens() {
  return new Promise((resolve, reject) => {
    db.query(tokenQuery.deleteExpiresTtl, (error, row, fields) => {
      if (error || row.length < 1) {
        reject({
          success: false,
          message: error ? error : "Something went wrong!",
        });
      } else {
        resolve(row);
      }
    });
  });
}

function deleteExpiredVerify() {
  return new Promise((resolve, reject) => {
    db.query(userVerifyQuery.deleteExpiresTtl, (error, row, fields) => {
      if (error || row.length < 1) {
        reject({
          success: false,
          message: error ? error : "Something went wrong!",
        });
      } else {
        resolve(row);
      }
    });
  });
}
module.exports = {
  authentic: authentic,
  signup: signup,
  forgotPass: forgotPass,
  getforgotPass: getforgotPass,
  newPassword: newPassword,
  verifyUser: verifyUser,
  deleteExpiredVerify: deleteExpiredVerify,
  deleteExpiredTokens: deleteExpiredTokens,
};
