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
		console.log('not yet implemented')
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
