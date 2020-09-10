const AppError = require('../utils/appError')

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	})
}
const sendErrorProd = (err, res) => {
	// Operational, trusted error -> send message to client

	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		})
	} else {
		console.error('ERROR', err) // log to the console in the production host
		res.status(500).json({
			status: 'error',
			message: 'something went extremply worng !'
		})
	}
}

const handleCastErrorDB = (error) => {
	const message = `Invalid ${error.path}: ${error.value}`
	return new AppError(message, 400)
}

const handleDuplicateFields = (error) => {
	const message = `Duplicate field value: -${error.keyValue.name}- choose another one`
	return new AppError(message, 400)
}

const handleValidationError = (error) => {
	const errors = Object.values(error.errors).map((item) => item.message) // iterate over error object to get all the messages
	const message = `Invalid input: ${errors.join(', ')}`
	return new AppError(message, 400)
}

//------------------------------------------------------------------------------------------------------------------------------------------

// Global error Handler middleware (by passing 4 arguments express automaticly assume it's a Global error )
const globalErrorHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500
	err.status = err.status || 'error'

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res)

		// HANDLE ERRORS FOR PRODUCTION
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...err }

		// handle 3 mongo errors : invalid field, duplicate, validation error
		if (error.name === 'CastError') error = handleCastErrorDB(error)
		if (error.code === 11000) error = handleDuplicateFields(error)
		if (error._message === 'Validation failed') error = handleValidationError(error)
		sendErrorProd(error, res)
	}
}
module.exports = globalErrorHandler
