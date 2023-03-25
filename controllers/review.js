const Review = require('../models/review');
const {ERROR_BED_REQUEST} = require("../utils/constants");
const BadRequestError = require("../errors/BadRequestError");
const Estate = require("../models/estate");

module.exports.createReview = (req, res, next) => {
  const {name, text} = req.body;
  const review = new Object({
    name: name,
    text: text,
  })
  Review.create(review)
    .then((review) => {
      res.send(review);
    })
    .catch((err) => {
      if (err.code === ERROR_BED_REQUEST.code) {
        next(new BadRequestError(ERROR_BED_REQUEST.message));
      } else {
        next(err);
      }
    });
}

module.exports.getReviews = (req, res, next) => {
  Review.find({})
    .then((reviews) => {
      res.send(reviews);
    })
    .catch(next);
}

module.exports.deleteReviews = (req, res, next) => {
  Estate.findByIdAndRemove(req.params.reviewId)
    .then((review) => {
      res.send({ review });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERROR_BED_REQUEST.message));
      } else {
        next(err);
      }
    });
};
