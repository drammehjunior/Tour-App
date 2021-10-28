const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');



const  app = express();

//set Security HTTP headers
app.use(helmet());


// 1) GLOBAL FIRST MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));


//Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//prevent parameter polllution
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', "ratingsAverage", "maxGroupSize", "difficulty", "price"]
})
);


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);

  next();
});

// 2) ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
//app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTERS


//This limit requests to the API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour!"
});

app.use('/api', limiter);


//this is the route to the requests
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


//this is the error handler, where we unavailable route is being handled
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't Find ${req.originalUrl} on this server`
  // });
  next(new AppError(`Can't Find ${req.originalUrl} on this server`, 404));
});



//this is the global error handler
app.use(globalErrorHandler);
module.exports = app;
