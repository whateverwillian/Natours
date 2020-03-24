const express = require('express')
const tourController = require('./../controller/tourController')
const authController = require('./../controller/authController')
const reviewRouter = require('./../routes/reviewRoutes')

//////////////////
// 3) Create the Router

const router = express.Router()

router.use('/:tourId/reviews', reviewRouter)

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit') 
    .get(tourController.getToursWithin)

router
    .route('/distances/:latlng/unit/:unit')
    .get(tourController.getDistances)

router.route('/top-5')
    .get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/tour-stats')
    .get(tourController.getTourStats)

router.route('/monthly-plan/:year')
    .get(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide', 'guide'), 
        tourController.getMonthlyPlan)

router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        tourController.createTour)

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        tourController.updateTour)
    .delete(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        tourController.deleteTour)

module.exports = router