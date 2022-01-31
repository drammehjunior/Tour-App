const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes')



const  app = express();

//setting the view Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//serves static files to the clienet 
app.use(express.static(path.join(__dirname, 'public')));


// 1) GLOBAL FIRST MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());


//set Security HTTP headers
app.use(helmet());

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
  console.log(req.cookies);

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

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);


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
