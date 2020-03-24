const express = require('express')

const authController = require('../controller/authController')
const bookingController = require('../controller/bookingController')

const router = express.Router()

router.get('/checkout-session/:tourId', 
    authController.protect,
    bookingController.getCheckoutSession)

// Only administrators
router.use(authController.restrictTo('admin'))

router.route('/')
    .get(bookingController.getAllBookings)
    .post(bookingController.createBooking)

router.route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking)

module.exports = router