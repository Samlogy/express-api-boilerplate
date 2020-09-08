const mongoose = require('mongoose')
const slugify = require('slug')
const validator = require('validator')

// ---------------------------------------------------------------------------------------------------------------------------------------------

const contactSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'The name is required'],
			unique: [true, 'Duplicated name not allowed'],
			trim: true, // remove spaces,
			maxlength: [20, 'A contact name must have less or equal that 20 characters'],
			minlength: [3, 'A contact name must have less or equal that 3 characters']
		},
		email: {
			type: String,
			validate: [validator.isEmail, 'Enter a valid email'] // custom validator using 3rd party library
		},

		age: Number,

		difficulty: {
			type: String,
			required: [true, 'A contact must have a difficulty'],
			enum: {
				// validator for strings
				values: ['easy', 'medium', 'Hard'],
				message: 'Difficulty is either: easy, medium or Hard'
			}
		},

		rating: {
			type: Number,
			default: 3,
			required: [true, 'the rating is required'],
			min: [1, 'Must be greater or equal to 1'],
			max: [5, 'Must be less or equal to 5']
		},

		level: {
			type: Number,
			required: false,
			min: [1, 'Must be greater or equal to 1'],
			max: [999, 'Must be less or equal to 999'],
			validate: {
				// custom validator ("val" argument is value of this field 'level' in this case)
				// custom validator does NOT work for UPDATE queries
				validator: function (val) {
					// write custom validator using Regex or anything else then return true and false
					return true
				},
				message: 'Your rating is too low'
			}
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

		slug: String
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

// Aggregation MIDDLWARES (this.pipeline() return the aggregation pipeline(type: Array) so we can add to it more aggragations)
contactSchema.pre('aggregate', function (next) {
	this.pipeline().unshift({
		$match: { secretContact: { $ne: true } }
	})

	next()
})

// ---------------------------------------------------------------------------------------------------------------------------------------------

// Define the Contact Model
const Contact = mongoose.model('Contact', (this.Schema = contactSchema), (this.collection = 'contacts'))

// ---------------------------------------------------------------------------------------------------------------------------------------------
// Export Contact Model
module.exports = Contact
