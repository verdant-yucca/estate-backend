const reviewRouter = require('express').Router();
const { getReviews, createReview} = require('../../controllers/review');
const {contentIdValidation} = require("../../middlewares/validatons");

reviewRouter.post('/review', createReview);
reviewRouter.get('/review', getReviews);

module.exports = reviewRouter;