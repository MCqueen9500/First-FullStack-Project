const express = require('express');
const route = express.Router({mergeParams: true});
const asyncwrap = require('../public/javascript/asyncwrap')
const path = require('path')
const {reviewSchema} = require('../schema');
const review = require("../collections/reviews");
const {isLogin,isUser,isReviewUser,SchemaValidate_for_review} = require('../middlware');
const reviewController = require('../controllers/review');

//review route

route.post('/',isLogin,
    SchemaValidate_for_review,
    asyncwrap(reviewController.createReview))

// review delete route

route.delete('/:reviewId',
    isLogin,
    isReviewUser,
    asyncwrap(reviewController.deleteReview))

module.exports = route;