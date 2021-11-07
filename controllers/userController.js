const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
// eslint-disable-next-line import/no-useless-path-segments
const APIFeatures = require("./../utils/apiFeatures");
const factory = require("./handlerFactory");


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

 exports.getAllUsers = catchAsync ( async (req, res, next) => {
  const modifiedUser = new APIFeatures(User.find(), req.query).filter().sort().limitFields().paginate();
  const users = await modifiedUser.query;
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.updateMe = catchAsync( async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if(req.body.password || req.body.confirmPassword){
    next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
  }

  //2) filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  console.log(filteredBody);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

  exports.deleteMe = catchAsync( async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false});

    res.status(204).json({
      status: 'success',
      data: null
    }); 
  });
  
 exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet ready',
    });
  };
  
  exports.getUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet ready',
    });
  };
  
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.factoryDelete(User);