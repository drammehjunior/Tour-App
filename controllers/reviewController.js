const Review = require("../models/reviewModel");
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync( async (req, res, next) => {
    const reviews = await Review.find();
    if(!reviews){
        return next(new AppError("There has been a error, Please wait a moment", 500));
    };

    res.status(201).json({
        status: 201,
        data: {
            reviews
        }
    });

});

exports.createReview = catchAsync( async (req, res, next) => {
    req.body.refToUser = req.user.id;
    const newReview = await Review.create(req.body);
    if(!newReview){
        next(new AppError("Saving data failed, please try again later", 500));
    };
    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    });
})