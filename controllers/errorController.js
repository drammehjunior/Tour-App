const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  //console.log(err);
  const value = err.errmsg.match(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/g);
  const message = `Duplicate field value: '${value}'. Please use the correct value`;
  return new AppError(message, 500);
};

const handleValidationErrorDB = (err) => {
  const value = Object.values(err.errors)
    .map((el) => el.properties.message)
    .join('. ');

  const message = `Invalid input data. ${value}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again', 401);
const handleJWTExpired = () => new AppError('Your token has expired! Please log in again', 401);

const sendErrorDev = (err, res) => {
  //console.log(err.name);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error info to client
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);
    //2) Send generic message

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    console.log(err);
    if (error.errorName === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.errorName === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.errorName === 'JsonWebTokenError') error = handleJWTError();
    if (error.errorName === 'TokenExpiredError') error = handleJWTExpired();
    sendErrorProd(error, res);
  }
};
