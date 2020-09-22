const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

//--------------------------------------------------------------------------------------------
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: [3, 'the name must have more or equal than 3 characters'],
		maxlength: [15, 'the name must have less or equal than 15 characters'],
		required: [true, 'the name is required'],
		trim: true
	},
	email: {
		type: String,
		required: [true, 'Please enter your email.'],
		lowercase: true,
		validate: [validator.isEmail, 'Please enter a valid email.'],
		unique: [true, 'This email already used, please choose another one.'],
		trim: true
	},
	photo: {
		type: String,
		validate: [validator.isURL, 'not a valid URL']
	},
	role: {
		type: String,
		enum: ['user', 'admin', 'lead-admin'],
		default: 'user'
	},
	password: {
		type: String,
		required: [true, 'please enter your password'],
		minlength: [6, 'The minimum required length is 6 characters'],
		select: false // very important : not show in any request
	},
	passwordConfirm: {
		type: String,
		required: [true, 'please confirm your password'],
		select: false, // very important : not show in any request
		validate: {
			validator: function (val) {
				if (this.password === val) return true
				return false
			},
			message: 'password do not match, please enter your password again.'
		}
	},
	passwordModifiedAt: Date,
	passwordResetToken: String,
	passwordResetTokenExpires: Date
})
//--------------------------------------------------------------------------------------------
// Middlewares
userSchema.pre('save', async function (next) {
	// isModified is a mongoose method to check only modified filelds
	if (!this.isModified('password')) return next()
	this.password = await bcrypt.hash(this.password, 12).then((this.passwordConfirm = undefined))
	this.passwordModifiedAt = new Date()
	next()
})

//--------------------------------------------------------------------------------------------
// Methods
// create method accessible in every mongodb document
userSchema.methods.checkPassword = async function (candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.checkPasswordTime = async function (tokenTimeCreation) {
	if (this.passwordModifiedAt) {
		const passwordTimeModifAt = parseInt(this.passwordModifiedAt.getTime() / 1000, 10)

		return !passwordTimeModifAt < tokenTimeCreation
	}
	return true
}
userSchema.methods.createPasswordResetToken = function () {
	// create token to sent to the user
	const resetToken = crypto.randomBytes(32).toString('hex')
	// hash token
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	// make the token expires 10 minutes
	this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000

	return resetToken
}
//--------------------------------------------------------------------------------------------
const User = mongoose.model('User', (this.schema = userSchema), (this.collection = 'users'))

module.exports = User
