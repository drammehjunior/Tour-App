const express = require('express');
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');
const reviewRoutes = require("./reviewRoutes");

const router = express.Router();

//router.param('id', tourController.checkID);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/just-check').get(tourController.checkController);

router.route('/monthly-plan/:year').get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);


//This is the nested route
router.use('/:tourId/reviews', reviewRoutes);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .delete(authController.protect,
            authController.restrictTo('admin', 'lead-guide'),
            tourController.deleteTour)
    .patch(tourController.updateTour);

// router
//     .route('/:tourId/reviews')
//     .post(authController.protect, authController.restrictTo('user'), reviewController.createReview)


module.exports = router;
