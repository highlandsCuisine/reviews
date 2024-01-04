const db = require("../database/connection");
const dbFunc = require("../database/db.function");
const { reviewQuery } = require("../database/sql/queries");

function addReview(reviews) {
  return new Promise((resolve, reject) => {
    const values = reviews.map(
      ({ author_name, author_url, profile_photo_url, text, rating, rid }) => [
        author_name,
        author_url,
        profile_photo_url,
        text,
        rating,
        rid,
      ]
    );

    db.query(reviewQuery.addreviewQuery, [values], (error, rows, fields) => {
      if (error) {
        dbFunc.connectionRelease;
        reject(error);
      } else {
        dbFunc.connectionRelease;
        resolve(rows);
      }
    });
  });
}

function getReviewsByID(id) {
  return new Promise((resolve, reject) => {
    db.query(reviewQuery.getreviewbyidQuery, [id], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}

function updateReviewsByID(data, id) {
  return new Promise((resolve, reject) => {
    const values = data.map(
      ({ author_name, author_url, profile_photo_url, text, rating, rid }) => [
        author_name,
        author_url,
        profile_photo_url,
        text,
        rating,
        rid,
      ]
    );

    db.query(reviewQuery.deletereviewQuery, [id], (error, rows, fields) => {
      if (error) {
        dbFunc.connectionRelease;
        reject(error);
      } else {
        db.query(
          reviewQuery.addreviewQuery,
          [values],
          (error, rows, fields) => {
            if (error) {
              dbFunc.connectionRelease;
              reject(error);
            } else {
              dbFunc.connectionRelease;
              resolve(rows);
            }
          }
        );
        dbFunc.connectionRelease;
        resolve(rows);
      }
    });
  });
}

module.exports = {
  addReview: addReview,
  getReviewsByID: getReviewsByID,
  updateReviewsByID: updateReviewsByID,
};
