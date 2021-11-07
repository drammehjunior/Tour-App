/* eslint-disable no-unused-vars */
const Review = require("../models/reviewModel");
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handlerFactory");

exports.getAllReviews = catchAsync( async (req, res, next) => {

    let filter = {};

    if(req.params.tourId) filter = {refToTour: req.params.tourId};
    const reviews = await Review.find(filter);
    if(!reviews){
        return next(new AppError("There has been a error, Please wait a moment", 500));
    };

    res.status(200).json({
        status: 200,
        reviewCount: reviews.length,
        data: {
            reviews
        }
    });

});

exports.setTourUserIds = catchAsync( async (req, res, next) => {
    if(!req.body.refToUser) req.body.refToUser = req.user.id;
    if(!req.body.refToTour) req.body.refToTour = req.params.tourId;
    next();
});

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.factoryDelete(Review);