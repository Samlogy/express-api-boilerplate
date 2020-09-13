const bcrypt = require('bcryptjs')
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
		const dataToUpdate = req.body

		if (dataToUpdate.password) {
			dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 12)

			if (dataToUpdate.passwordConfirm) delete dataToUpdate.passwordConfirm
		}
		const userUpdate = await User.findByIdAndUpdate(req.params.id, dataToUpdate, {
			new: true,
			runValidators: true
		})
		if (!userUpdate) return next(new AppError('This user is not found', 401))

		res.status(201).json({
			status: 'success',
			data: userUpdate
		})
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
