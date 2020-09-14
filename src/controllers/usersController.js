const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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
		// pretty much everything here will change cause we DONT update password like this
		const dataToUpdate = req.body

		if (dataToUpdate.password) {
			dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 12)

			if (dataToUpdate.passwordConfirm) delete dataToUpdate.passwordConfirm
		}
		const userUpdate = await User.findByIdAndUpdate(req.params.id, dataToUpdate, {
			new: true,
			runValidators: true
		})
		jwt.sign(
			{ id: req.params.id },
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRES_IN
			},
			function (err, tok) {
				res.status(201).json({
					status: 'success',
					token: tok,
					data: userUpdate
				})
			}
		)
		if (!userUpdate) return next(new AppError('This user is not found', 401))
	} catch (err) {
		next(err)
	}
}

const deleteUser = (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'not implemented yet'
	})
}

const addUser = (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'not implemented yet'
	})
}

module.exports = { addUser, getAllUsers, getUser, deleteUser, updateUser }
