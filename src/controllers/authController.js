const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const AppError = require('../utils/appError')

exports.signup = async (req, res, next) => {
	try {
		const newUser = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			passwordConfirm: req.body.password
		})

		const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN
		})
		res.status(201).json({
			status: 'success',
			token: token,
			data: {
				user: newUser
			}
		})
	} catch (err) {
		next(err)
	}
}
//-------------------------------------------------------------------------------------------------------------------------------------------
exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body

		// verify if email or password are empty
		if (!email || !password) next(new AppError('Email and Password are mandatory to login', 400))

		// verify in database if email and password are correct
		const user = await User.find({ email: { $eq: email } }).select('+password') // the + sign is used to select a field that has been turned false in the model
		const userMatched = user[0] // extract the user from the array ( we can use findOne instead)

		if (userMatched) {
			const checkPassword = await userMatched.checkPassword(password, userMatched.password)
			if (!checkPassword) return next(new AppError('Incorrect email or password, please try again.', 401))

			const token = jwt.sign({ id: userMatched._id }, process.env.JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRES_IN
			})

			res.status(200).json({
				status: 'success',
				token: token // the id is inside  the token
			})
		} else {
			return next(new AppError('Incorrect email or password, please try again.', 401))
		}
	} catch (err) {
		next(err)
	}
}

exports.checkAccess = async (req, res, next) => {
	try {
		let token
		// get token from client
		if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
			token = req.headers.authorization.split(' ')[1]
		} else return next(new AppError('You are not loged in, please login to get access', 401))

		// verify token
		jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
			if (decoded) {
				// check if the user still exists
				const user = await User.findById(decoded.id)
				if (!user) return next(new AppError('The user of this token no longer exist.', 401))

				if (!(await user.checkPasswordTime(decoded.iat)))
					return next(new AppError('Token has been changed due to recent user update', 401))

				console.log('Acces garanteed')
				next()
			} else {
				next(err)
			}
		})
	} catch (err) {
		next(err)
	}
}
