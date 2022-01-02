/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');
//import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, "A tour must have less or equal to 40 character"],
    minlength: [10, "A tour must have more or equal to 10 characters"]
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, "a tour must have a rating"],
    enum: {
      values:  ['easy', 'medium', 'difficult'],
      message: "Dificulty is either: easy, medium, and difficult"
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "Ratings must be above 1.0"],
    max: [5, "Rating must be below 5"],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val){
        return val < this.price;
      },
      message: "discount price ({VALUE}) is invalid, it cant be greater than the actual price"
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },
  startLocation: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    } 
  ],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({slug: 1});
tourSchema.index({startLocation: "2dsphere"});

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});




//NOTE FOR MYSELF, map function return a promise and Promise.all needs to be used to get the data
// tourSchema.pre('save', async function(next){
//   const guidesPromise = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromise);
//   next();
// });


//DOCUMENT MIDDLEWARE, it runs before .save() and .create()  //NOT insertMany


//document middleware is also the same as express middleware, in .pre we have access to next parameter to be called
tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower: true});
  next();
});


// //.post have the access to doc (document that is saved) and next
// tourSchema.post('save', function(doc, next){
//   console.log(doc);
//   next();
// });


//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next){

   this.find({ secretTour:  {$ne: true}});
   
   this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next){
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
})

tourSchema.post(/^find/, function(docs, next){
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  //console.log(docs);
  next();
});

//  AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next){

//   this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
//   console.log(this);
//   console.log(this.pipeline());
//   next();
// })



const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
