// 3rd party modules
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xssCleaner = require('xss-clean')

//own imports
const contactsRouter = require('./src/routes/contactsRoutes')
const usersRouter = require('./src/routes/usersRoutes')
const AppError = require('./src/utils/appError')
const globalErrorHandler = require('./src/controllers/errorController')
//-------------------------------------------------------------------------------------------

// declare express
const app = express()

// allow 100 request from same IP in 1h
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again later'
})

//-------------------------------------------------------------------------------------------
// 1) GLOBAL middlewares

// security HTTP headers
app.use(helmet())

// log to the console information
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

// limit request from same IP
app.use('/api', limiter)

// serving/use static files
app.use(express.static('folder-name'))

// parse body json format in the body
app.use(express.json({ limit: '10kb' }))

// data sanitization against NoSQL injection
app.use(mongoSanitize())
// data sanitization against XSS to prevent HTML code inside database
app.use(xssCleaner())
//-------------------------------------------------------------------------------------------
//ROUTES
app.use('/api/v1/contacts', contactsRouter)
app.use('/api/v1/users', usersRouter)

//-------------------------------------------------------------------------------------------

// handle inexistant routes
app.all('*', (req, res, next) => {
	// if we pass something to next() express will assume it is an error object and call Global error handling middlware immedialtly
	next(new AppError(`the url ${req.originalUrl} is not found`, 404))
})

//-------------------------------------------------------------------------------------------
// Global Error handling middleware
app.use(globalErrorHandler)

//-------------------------------------------------------------------------------------------
//EXPORTS
module.exports = app
