const express = require('express')
const viewsController = require('../controller/viewsController')
const authController = require('../controller/authController')
const bookingController = require('../controller/bookingController')

const router = express.Router()

router.get('/me', authController.protect, viewsController.getAccount)
router.get('/my-tours', authController.protect, bookingController.getMyTours)

router.use(authController.isLoggedIn)

router.get('/', 
    bookingController.createBookingCheckout,
    viewsController.getOverview)
router.get('/tour/:slug', viewsController.getTour)
router.get('/login', viewsController.login)
    
module.exports = router