const express = require('express')
const morgan = require('morgan')
const contactsRouter = require('./src/routes/contactsRoutes')
const usersRouter = require('./src/routes/usersRoutes')
const AppError = require('./src/utils/appError')
const globalErrorHandler = require('./src/controllers/errorController')
//-------------------------------------------------------------------------------------------

// declare express
const app = express()

//-------------------------------------------------------------------------------------------
// express midlewares

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev')) // log to the console information
}
app.use(express.static('folder-name')) // serve static files with build in express method ( see other alternatives)
app.use(express.json()) // to be able to use json format in the body

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
