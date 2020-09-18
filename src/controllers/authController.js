const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/sendEmail')

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
		return next(err)
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
		return next(err)
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

				// add the user to the request.user object
				req.user = user

				return next()
			}
			return next(err)
		})
	} catch (err) {
		return next(err)
	}
}

// we want to pass arguments to restrictTo function so we create a wrapper function
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		// roles is an array like ['admin','lead-admin']
		if (!roles.includes(req.user.role)) {
			return next(new AppError('You do not have permission, need admin privilege.', 403))
		}
		return next()
	}
}

exports.forgotPassword = async (req, res, next) => {
	try {
		// 1- get user based on POSTED email
		const user = await User.findOne({ email: req.body.email })
		if (!user) return next(new AppError('No user found with this email, please try another one.', 404))

		// 2- generale random reset token and save the modifications to database
		const resetToken = user.createPasswordResetToken()
		// save modif to mongodb
		await user.save([{ validateBeforeSave: false }])
		// 3- send it to user email
		const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`
		await sendEmail({
			email: user.email,
			message: `forgot your password, submit new password in the next 10 minutes \n Password reset link : ${resetURL}`,
			subject: 'Naise support password reset'
		})

		res.status(200).json({
			status: 'success',
			message: 'Reset password token sent to user email.'
		})
	} catch (err) {
		const user = await User.findOne({ email: req.body.email })
		user.passwordResetToken = undefined
		user.passwordResetTokenExpires = undefined
		await user.save()

		return next(new AppError('There is an error trying to reset password, please try again later', 500))
	}
}

exports.resetPassword = async (req, res, next) => {
	try {
		// 1) get user based on the token
		const { password, passwordConfirm } = req.body
		const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
		const user = await User.findOne({ passwordResetToken: { $eq: token } })
		// 2) check token expiration, user, set the new password
		if (!user) return next(new AppError('User not found', 400))

		if (Date.now() - user.passwordResetTokenExpires <= 10) {
			user.password = password
			user.passwordConfirm = passwordConfirm
			user.passwordModifiedAt = new Date()
		} else return next(new AppError('Password reset token expired', 400))
		// 3) update password
		await user.save()

		// 4) log user, send JWT token
		const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN
		})

		res.status(200).json({
			status: 'success',
			token: jwtToken,
			message: 'password updated success, login...'
		})
	} catch (err) {
		return next(err)
	}
}
