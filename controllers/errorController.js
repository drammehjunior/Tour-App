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

const sendErrorDev = (err, req, res) => {
  //This is for api
  if (req.originalUrl.startsWith('/api')) {
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //This is for rendered website
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  //Operational, trusted error: send message to client

  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error: don't leak error info to client
    }
    // 1) Log error
    console.error('ERROR 💥', err);
    //2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  // 1) Log error
  console.error('ERROR 💥', err);
  //2) Send generic message
  return res.status(500).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    if (error.errorName === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.errorName === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.errorName === 'JsonWebTokenError') error = handleJWTError();
    if (error.errorName === 'TokenExpiredError') error = handleJWTExpired();
    sendErrorProd(error, req, res);
  }
};
