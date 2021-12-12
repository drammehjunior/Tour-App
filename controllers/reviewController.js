/* eslint-disable no-unused-vars */
const Review = require("../models/reviewModel");
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handlerFactory");



exports.setTourUserIds = catchAsync( async (req, res, next) => {
    if(!req.body.refToUser) req.body.user = req.user.id;
    if(!req.body.refToTour) req.body.tour = req.params.tourId;
    next();
});

exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.factoryDelete(Review);