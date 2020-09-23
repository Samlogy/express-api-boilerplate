const AppError = require('../utils/appError')
const User = require('../models/userModel')

// export functions
const getAllUsers = (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'not implemented yet'
	})
}

const getUser = (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'not implemented yet'
	})
}

const updateUser = async (req, res, next) => {
	try {
		// 1- create error if user POST password data
		if (req.body.password || req.body.passwordConfirm)
			return next(new AppError("can't use this route for password update, please use: /update-password"), 400)
		// 2- update user document
		const user = await User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true })
		res.status(200).json({
			status: 'success',
			user: user
		})
	} catch (err) {
		return next(err)
	}
}

const deleteUser = async (req, res, next) => {
	try {
		// switch acount to inactive
		await User.findByIdAndUpdate(req.user._id, { active: false })
		res.status(204).json({
			status: 'success',
			message: 'switch to inactive account'
		})
	} catch (err) {
		return next(err)
	}
}

const addUser = (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'not implemented yet'
	})
}

module.exports = { addUser, getAllUsers, getUser, deleteUser, updateUser }
