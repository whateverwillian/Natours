const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

/////////////////////////////////
// VIEW HANDLERS
////////////////////////////////

exports.getOverview = catchAsync(async (req, res, next) => {

    // 1) Get tour data from collection
    const tours = await Tour.find()

    // 2) Buil template
    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'All tours',
        tours
    })
})

exports.getTour = catchAsync(async (req, res, next) => {

    // 1) Get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields:'review rating user'
    })

    if (!tour) return next(new AppError('The tour doesnt exist.'), 400)
    // 2) Build template
    // 3) Render template using data
    res.status(200).render('tour', {
        title: tour.name,
        tour
    })
})

// 1) /login route
// 2) controller
// 3) template
exports.login = (req, res, next) => {
    res.status(200).render('login', {
        title: 'Login'
    })
}

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your Account'
    })
}