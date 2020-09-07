const mongoose = require('mongoose')
const slugify = require('slug')

// ---------------------------------------------------------------------------------------------------------------------------------------------

const contactSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'The name is required'],
			unique: [true, 'Duplicated name not allowed'],
			trim: true // remove spaces
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

		calls: [Date],

		createdAt: {
			type: Date,
			default: Date.now(),
			select: false // hide createdAt when responding to a request, usefull for sensitive data (password)
		},

		images: [String],

		secretContact: {
			type: Boolean,
			default: false
		},

		slug: String,

		startTimerReq: Date
	},
	{
		toJSON: { virtuals: true }, // enable virtula propreties to be rendered
		toObject: { virtuals: true } // enable virtula propreties to be rendered
	}
)
// ---------------------------------------------------------------------------------------------------------------------------------------------

// define a virtual proprety for the Contact Schema ( CAN NOT use query on virtual propreties)
contactSchema.virtual('numOfCalls').get(function () {
	return this.calls.length
})
// ---------------------------------------------------------------------------------------------------------------------------------------------

// Document MIDDLEWARES
// Document MIDDLEWARE: runs before .save() or .create() ONLY
contactSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true }) // "this" keyword have acces to the document before the save to database so we can modify it
	next()
})

// this middleware runs after save (does not have "this" keyword, we have acces directly from "doc" argument in the callback)
contactSchema.post('save', function (doc, next) {
	// console.log('final saved document:', doc)
	next()
})

// Query MIDDLEWARES like (find())
contactSchema.pre(/^find/, function (next) {
	this.find({ secretContact: { $ne: true } })
	next()
})
contactSchema.post(/^find/, function (docs, next) {
	console.log(`Query filtred succefully`)
	next()
})
// ---------------------------------------------------------------------------------------------------------------------------------------------

// Define the Contact Model
const Contact = mongoose.model('Contact', (this.Schema = contactSchema), (this.collection = 'contacts'))

// ---------------------------------------------------------------------------------------------------------------------------------------------
// Export Contact Model
module.exports = Contact
