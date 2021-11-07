const express = require('express');
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');
const reviewRoutes = require("./reviewRoutes");

const router = express.Router();

//router.param('id', tourController.checkID);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router.route('/just-check').get(tourController.checkController);


//This is the nested route
router.use('/:tourId/reviews', reviewRoutes);

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour);

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
