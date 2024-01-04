const { ErrorHandler } = require("../helper/errorHandler");
const revServices = require("../services/reviews.service");

exports.getReviewByID = async (req, res, next) => {
  const { id } = await req.params;
  await revServices
    .getReviewByID(id)
    .then((data) => {
      if (data && data.length > 0) {
        return res.status(200).json({
          success: true,
          data: data,
          message: "Review fetched successfully!",
        });
      }
      return next(
        new ErrorHandler(404, "Not Found: Restaurant with that id not found")
      );
    })
    .catch((e) => {
      return next(new ErrorHandler(500, e));
    });
};

exports.updateReviewsByID = async (req, res, next) => {
  const { link, rid } = await req.body;
  fetch(`${link}`)
    .then(async (response) => await response.json())
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
          rid: rid,
        });
      });
      revServices
        .updateReviewsByID(revData, rid)
        .then((data) => {
          res.status(200).json({
            success: "true",
            message: "Review fetched and updated successfully!",
          });
        })
        .catch((e) => {
          return next(new ErrorHandler(500, e));
        });
    });
};
