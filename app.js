const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

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
app.use(express.urlencoded({extended: true, limit: '10kb'}))
app.use(cookieParser());

//set Security HTTP headers
// app.use(
//   helmet({
//     crossOriginEmbedderPolicy: false,
//     contentSecurityPolicy: {
//       directives: {
//         'child-src': ['blob:'],
//         'connect-src': ['https://*.mapbox.com'],
//         'default-src': ["'self'"],
//         'font-src': ["'self'", 'https://fonts.gstatic.com'],
//         'img-src': ["'self'", 'data:', 'blob:'],
//         'script-src': ["'self'", 'https://*.mapbox.com'],
//         'style-src': ["'self'", 'https:'],
//         'worker-src': ['blob:'],
//       },
//     },
//   })
// );

//app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));


app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://*.cloudflare.com',
  'https://js.stripe.com/v3/',
  'https://checkout.stripe.com',
];
const styleSrcUrls = [
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://www.myfonts.com/fonts/radomir-tinkov/gilroy/*',
  ' checkout.stripe.com',
];
const connectSrcUrls = [
  'https://*.mapbox.com/',
  'https://*.cloudflare.com',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:52191',
  '*.stripe.com',
];

const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:'],
      fontSrc: ["'self'", ...fontSrcUrls],
      frameSrc: ['*.stripe.com', '*.stripe.network'],
    },
  })
);

//Data Sanitization against NoSQL query injection
app.use(mongoSanitize())

//Data sanitization against XSS
app.use(xss());

//prevent parameter polllution
app.use(
  hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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
  message: 'Too many request from this IP, please try again in an hour!',
});

app.use('/api', limiter);

//this is the route to the requests

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

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
