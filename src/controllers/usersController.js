const fs = require('fs')
// export functions
const contacts = JSON.parse(fs.readFileSync('db.json'))

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

const updateUser = (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'not implemented yet'
	})
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
