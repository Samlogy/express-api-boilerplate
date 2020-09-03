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
		default: Date.now()
	},
	images: [String]
})

const Contact = mongoose.model(
	'Contact',
	(this.Schema = contactSchema),
	(this.collection = 'contacts')
)

module.exports = Contact
