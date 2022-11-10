const Tour = require('../models/tourModel');
const catchasync = require('../utils/catchAsync');

exports.getOverview = catchasync(async (req, res, next) => {
  // 1) Get tour data from the collecrtion
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchasync(async (req, res) => {
  // 1) get the data, for the requested tour (including reviews and tour guides)
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug: slug }).populate({
    path: 'reviews',
    select: 'review user rating',
  });

  //console.log(tour);

  // 2) Build Template

  // 3) Render template from 1)
  //console.log(tour)

  res
    .status(200)
    .set('Content-Security-Policy', 'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com')
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
});

exports.login = catchasync(async (req, res) => {
  res.status(200).set('Content-Security-Policy', "connect-src 'self' https://cdnjs.cloudflare.com").render('login', {
    title: 'Log into your account',
  });
});
