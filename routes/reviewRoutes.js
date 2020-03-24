const express = require('express')

const authController = require('../controller/authController')
const reviewController = require('../controller/reviewController')

const router = express.Router({ mergeParams: true })

router.use(authController.protect)

router
    .route('/')
    .get(
        reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview)

router
    .route('/:id')
    .get(
        reviewController.getReview)
    .delete(
        authController.restrictTo('admin'),
        reviewController.deleteReview)
    .patch(
        authController.restrictTo('admin'),
        reviewController.updateReview)


module.exports = router