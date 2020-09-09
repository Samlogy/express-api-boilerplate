const express = require('express')
const morgan = require('morgan')
const contactsRouter = require('./src/routes/contactsRoutes')
const usersRouter = require('./src/routes/usersRoutes')
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

// handle inexistant routes
app.all('*', (req, res, next) => {
	res.status(404).json({
		status: 'fail',
		message: `the url ${req.originalUrl} is not found`
	})
	next()
})

//-------------------------------------------------------------------------------------------

module.exports = app
