const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.factoryDelete = model => catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);
  
    if (!doc) {
      return next(new AppError('No tour found with that ID', 404));
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
