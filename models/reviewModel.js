/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const validator = require('validator');
const Tour = require('./tourModel');
const User = require('./userModel');

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, "the review cannot be empty"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        min: [1, "Ratings must be above 1"],
        max: [5, "Ratings must below 5"]
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'    
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

// reviewSchema.pre(/^find/, function(next){
//     this.populate({
//         path: 'refToTour',
//         select: 'name'
//     }).populate({
//         path: 'refToUser',
//         select: 'name _id email'
//     });

//     next();
// });

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: 'user',
        select: 'name _id email'
    });

    next();
});


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;