const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require('../utils/apiFeatures');


exports.factoryDelete = model => catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
  
    res.status('204').json({
      status: 'success',
      data: doc,
    });
  });

exports.updateOne = model => catchAsync(async (req, res, next) => {
  const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status('200').json({
    status: 'success',
    data: {
      doc,
    },
  });
});

exports.createOne = model => catchAsync(async (req, res, next) => {
  // const newTours = new Tour({});
  // newTour.save()
  const doc = await model.create(req.body);
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      doc
    },
  });
});

exports.getOne = (model, populateOptions) => catchAsync(async (req, res, next) => {
  let query = model.findById(req.params.id);
  if(populateOptions){
    query.populate(populateOptions);
  }
  const doc = await query;
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    },
  });
});

exports.getAll = model => 
  catchAsync(async (req, res) => {

    let filter = {};
    if(req.params.tourId) filter = {tour: req.params.tourId};
    
    const features = new APIFeatures(model.find(filter), req.query).filter().sort().limitFields().paginate();
    const doc = await features.query;
    //query.sort().sort().skip().limit()
  
    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      },
    });
  });