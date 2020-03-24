const express = require('express')
const userController = require('./../controller/userController')
const authController = require('./../controller/authController')

///////////////////////////
// 2. Create the Router
const router = express.Router()

router.post('/signup', authController.signUp)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

// Middleware Login
router.use(authController.protect)

router.patch('/updateMyPassword', 
    authController.updatePassword)

router.get('/me', userController.getMe, userController.getUser)
router.patch('/updateMe', 
    userController.uploadUserPhoto, 
    userController.resizeUserPhoto,
    userController.updateMe)

router.delete('/deleteMe', userController.deleteMe)

router
    .route('/')
    .get( userController.getAllUsers)
    .post( userController.createUser)

// Just ADMIN and LEAD GUIDES
router.use(authController.restrictTo('admin'))

router
    .route('/:id')
    .get( userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router