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
    refTOTour: {
        type: mongoose.Schema.ObjectID,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.']
    },
    refToUser: {
        type: mongoose.Schema.ObjectID,
        ref: 'User',
        required: [true, "Review must belong to a user."]
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });




const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;