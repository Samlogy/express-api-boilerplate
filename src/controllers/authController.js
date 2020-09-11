const User = require('../models/userModel')

exports.signup = async (req, res, next) => {
	try {
		const newUser = await User.create(req.body)
		res.status(201).json({
			status: 'success',
			data: newUser
		})
	} catch (err) {
		next(err)
	}
}
