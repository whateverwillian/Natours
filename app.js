const path = require('path')
const morgan = require('morgan')
const express = require('express')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const cookieParser = require('cookie-parser')
const app = express()

const AppError = require('./utils/appError')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const bookingRouter = require('./routes/bookingRoutes')
const viewRouter = require('./routes/viewRoutes')

const globalErrorHandler = require('./controller/errorController')
const rateLimit = require('express-rate-limit')
const xss = require('xss-clean')
const hpp = require('hpp')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// 1) Global Middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// Set security HTTP headers 
app.use(helmet())

// Prevenindo muitas requests de um mesmo IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
})

app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

// A) Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// B) Data sanitization against XSS
app.use(xss())

// C) Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration', 
        'ratingsQuantity',
        'ratingsAverage',
        'maxGoupSize', 
        'difficulty', 
        'price'
    ]
}))

// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// 2) Montando routers (Middlewares)
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

// Aqui chega apenas o que não entrou nas middlewares anteriores
app.all('*', (req, res, next) => {
    
    next(new AppError(`Can't find ${req.originalUrl} on this server!`))
})

// Error handling
app.use(globalErrorHandler)

module.exports = app

// Servidor > app.use Routers > router > handle router