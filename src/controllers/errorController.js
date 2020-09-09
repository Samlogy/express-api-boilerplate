//Global Error handling middleware (by passing 4 arguments express automaticly assume it's a Global error handling middlware)
const globalErrorHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500
	err.status = err.status || 'error'

	res.status(err.statusCode).json({
		status: err.status,
		message: err.message
	})
}
module.exports = globalErrorHandler
