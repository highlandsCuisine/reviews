const dbFunc = require("../database/db.function");
const resModel = require("../model/restaurant.model");
function addRestaurant(resData) {
  return new Promise((resolve, reject) => {
    resModel
      .addRestaurant(resData)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
function getRestaurant() {
  return new Promise((resolve, reject) => {
    resModel
      .getRestaurant()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function deleteRestaurant(id) {
  return new Promise((resolve, reject) => {
    resModel
      .deleteRestaurant(id)
      .then((r) => {
        dbFunc.connectionRelease;
        resolve(r);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

module.exports = {
  addRestaurant: addRestaurant,
  getRestaurant: getRestaurant,
  deleteRestaurant: deleteRestaurant,
};
