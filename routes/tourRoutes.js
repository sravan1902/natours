const express = require('express');
const tourController = require('./../controllers/tourController');

const authController = require('./../controllers/authController');

const reviewRouter = require('./../routes/reviewRoutes');

// Routes
const router = express.Router();

// param middleware
// router.param("id", tourController.checkID);

// Create a checkBody middleware
// check if body contains the name and price property
// if not, send 400 (bad request)
// add it tot the post handler satck

// ## Nested Routes
// POST /tour/2874090/reviews
// GET /tour/2874090/reviews
// GET /tour/2874090/reviews/9789099

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview,
//   );

router.use('/:tourId/reviews', reviewRouter);

// writing a middleware for getting top 5 cheap tours
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
//tours-distance?distance=233&center=-40,45&unit=mi
// tours-distance/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
