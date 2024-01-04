var authenticModel = require("../model/auth.model");

function authentic(authenticData) {
  return new Promise((resolve, reject) => {
    authenticModel
      .authentic(authenticData)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function signup(signUpData, token) {
  return new Promise((resolve, reject) => {
    authenticModel
      .signup(signUpData, token)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getforgotPass(user, token) {
  return new Promise((resolve, reject) => {
    authenticModel
      .getforgotPass(user, token)
      .then((da) => {
        resolve(da);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

function forgotPass(id, token) {
  return new Promise((resolve, reject) => {
    authenticModel
      .forgotPass(id, token)
      .then((da) => {
        resolve(da);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

function newPassword(user) {
  return new Promise((resolve, reject) => {
    authenticModel
      .newPassword(user)
      .then((da) => {
        resolve(da);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

function deleteExpiredTokens() {
  return new Promise((resolve, reject) => {
    authenticModel
      .deleteExpiredTokens()
      .then((da) => {
        resolve(da);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

function verifyUser(id, token) {
  return new Promise((resolve, reject) => {
    authenticModel
      .verifyUser(id, token)
      .then((da) => {
        resolve(da);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

function deleteExpiredVerify() {
  return new Promise((resolve, reject) => {
    authenticModel
      .deleteExpiredVerify()
      .then((da) => {
        resolve(da);
      })
      .catch((e) => {
        reject(e);
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
