const { validationResult } = require("express-validator");
const { ErrorHandler } = require("../helper/errorHandler");
const resServices = require("../services/restaurant.service");
const revServices = require("../services/reviews.service");

exports.addRestaurant = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const e = errors.mapped();
    return next(
      new ErrorHandler(
        400,
        `${e.name ? e.name.msg : ""}\n${e.link ? e.link.msg : ""}\n`
      )
    );
  }
  const { name, link } = await req.body;
  await resServices
    .addRestaurant({ name: name, link: link })
    .then((rest) => {
      fetch(`${link}`)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(async (response) => {
          const { reviews } = await response.result;
          const fiveStarReviews = await reviews.filter(
            (review) => review.rating === 5
          );
          let revData = [];
          fiveStarReviews.map((data) => {
            revData.push({
              author_name: data.author_name,
              author_url: data.author_url,
              profile_photo_url: data.profile_photo_url,
              text: data.text,
              rating: data.rating,
              rid: rest.insertId,
            });
          });
          revServices.addReview(revData).then((data) => {
            res.status(200).json({
              success: "true",
              message: "Restaurant fetched and added successfully!",
            });
          });
        })
        .catch((e) => {
          return next(new ErrorHandler(500, e));
        });
    })
    .catch((e) => {
      return next(new ErrorHandler(500, e));
    });
};

exports.getRestaurant = async (req, res, next) => {
  await resServices
    .getRestaurant()
    .then((data) => {
      res.status(200).json({
        success: true,
        data: data,
        message: "Restaurant fetched successfully!",
      });
    })
    .catch((e) => {
      return next(new ErrorHandler(500, e));
    });
};

exports.deleteRestaurant = async (req, res, next) => {
  const { id } = await req.params;
  await resServices
    .deleteRestaurant(id)
    .then((data) => {
      res.redirect("/admin/dvls/googlereviews/adminpannel");
    })
    .catch((e) => {
      return next(new ErrorHandler(500, e));
    });
};

exports.getRestaurantData = async () => {
  const data = await resServices.getRestaurant();
  return data;
};
