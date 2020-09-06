const mongoose = require('mongoose')
//---------------------------------------------
const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'The name is required'],
		unique: [true, 'Duplicated name not allowed'],
		trim: true
	},
	age: Number,
	difficulty: {
		type: String,
		required: [true, 'choose a difficulty']
	},
	rating: {
		type: Number,
		default: 3,
		required: [true, 'the rating is required']
	},
	level: {
		type: Number,
		required: false
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		select: false // hide createdAt when responding to a request, usefull for sensitive data (password)
	},
	images: [String]
})

const Contact = mongoose.model('Contact', (this.Schema = contactSchema), (this.collection = 'contacts'))

module.exports = Contact
