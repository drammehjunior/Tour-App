// eslint-disable-next-line import/no-useless-path-segments
const AppError = require("../utils/appError");

// eslint-disable-next-line arrow-body-style
module.exports = fn => {
    return (req, res, next) => {
      fn(req, res, next).catch((err) => {
          next(new AppError(err));
      });
    }
  }
  