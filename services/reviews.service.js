const revModel = require("../model/reviews.model");
function addReview(revData) {
  return new Promise((resolve, reject) => {
    revModel
      .addReview(revData)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getReviewByID(id) {
  return new Promise((resolve, reject) => {
    revModel
      .getReviewsByID(id)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function updateReviewsByID(data, id) {
  return new Promise((resolve, reject) => {
    revModel
      .updateReviewsByID(data, id)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  addReview: addReview,
  getReviewByID: getReviewByID,
  updateReviewsByID: updateReviewsByID,
};
