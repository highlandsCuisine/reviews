const db = require("../database/connection");
const dbFunc = require("../database/db.function");
const { restaurantQuery, reviewQuery } = require("../database/sql/queries");

function addRestaurant(res) {
  return new Promise((resolve, reject) => {
    db.query(
      restaurantQuery.addrestaurantQuery,
      [res.name, res.link],
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
  });
}

function getRestaurant() {
  return new Promise((resolve, reject) => {
    db.query(restaurantQuery.getrestaurantQuery, (err, row, fields) => {
      if (err) {
        dbFunc.connectionRelease;
        reject(err);
      } else {
        dbFunc.connectionRelease;
        resolve(row);
      }
    });
  });
}

function deleteRestaurant(id) {
  return new Promise((resolve, reject) => {
    db.query(reviewQuery.deletereviewQuery, [id], (reviewErr, reviewResult) => {
      if (reviewErr) {
        dbFunc.connectionRelease;
        reject(reviewErr);
      } else {
        db.query(
          restaurantQuery.deleterestaurantQuery,
          [id],
          (restaurantErr, restaurantResult) => {
            dbFunc.connectionRelease;
            if (restaurantErr) {
              reject(restaurantErr);
            } else {
              resolve({
                reviews: reviewResult,
                restaurant: restaurantResult,
              });
            }
          }
        );
      }
    });
  });
}

module.exports = {
  addRestaurant: addRestaurant,
  getRestaurant: getRestaurant,
  deleteRestaurant: deleteRestaurant,
};
