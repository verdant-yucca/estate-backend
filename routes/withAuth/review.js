const reviewRouter = require('express').Router();
const { getReviews, createReview, deleteReviews} = require('../../controllers/review');
const {reviewIdValidation} = require("../../middlewares/validatons");

reviewRouter.post('/review', createReview);
reviewRouter.get('/review', getReviews);
reviewRouter.delete('/review/:reviewId', reviewIdValidation, deleteReviews);

module.exports = reviewRouter;