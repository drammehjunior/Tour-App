/* eslint-disable prefer-object-spread */
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkBody = (req, res, next) => {
//   if (req.body.name === undefined || req.body.price === undefined) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Bad Request',
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary';
  console.log(req.query);
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, {path: 'reviews'});
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.factoryDelete(Tour);


exports.getToursWithin = catchAsync( async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  //if(unit == 'miles' || unit == 'kilometers')
  
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if(!lat || !lng){
    next(AppError('Please provide latitude and longitude int he format of lat,lng.', 400));
  }

  const tours = await Tour.find({ 
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } 
  });
  
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync( async (req, res, next) => {
  const {latlng, unit} = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === "mi" ? 0.000621371 : 0.001

  if(!lat || !lng){
    next( new AppError('Please provide with the longitude and the latitude in the format of lat,lng', 400));
  };

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project : {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      data: distances
    }
  });
});

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status('200').json({
      status: 'success',
      results: stats.length,
      data: stats,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.checkController = async (req, res) => {
  let temp = Tour.find();
  console.log(temp);
  temp = temp.sort('-price');
  const results = await temp;
  res.status(200).json({
    status: 'success',
    message: 'this is done successfully',
    data: results,
  });
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = Number(req.params.year);
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      result: plan.length,
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.justTesting = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'This site is not yet ready for use',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
