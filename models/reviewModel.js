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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: 'user',
        select: 'name _id email'
    });

    next();
});

reviewSchema.statics.calAverageRating = async function(tourId){
    const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group: { 
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating'}
            }
        }
    ]);

    if(stats.length > 0){
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    }else{
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
    console.log(stats);
};


reviewSchema.post('save', function(){
    this.constructor.calAverageRating(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(){ 
  this.doc = await this.findOne();
  console.log(this.doc);
});

reviewSchema.post(/^findOneAnd/, async function(){
  await this.doc.constructor.calAverageRating(this.doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;