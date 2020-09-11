const Contact = require('../models/contactModel')
const ApiFeatures = require('../utils/apiFeatures')
const catchAsyncError = require('../utils/catchAsyncError')
const AppError = require('../utils/appError')
//-------------------------------------------------------------------------------------------

// CONTROLLERS
const checkId = (req, res, next, val) => {
	next()
}
//-------------------------------------------------------------------------------------------
const checkPostForm = (req, res, next) => {
	next()
}
const aliasTopContacts = (req, res, next) => {
	req.query.limit = 3
	req.query.sort = '-rating,-age'
	next()
}

//-------------------------------------------------------------------------------------------
const getAllContacts = catchAsyncError(async (req, res, next) => {
	// Execute QUERY and apply
	const data = new ApiFeatures(Contact.find(), req.query)
	data.filter().limitingFields().sort().limitContentAndOrPagination()
	const contacts = await data.query // await for 1,2,3,4,5,6

	// respond
	res.status(200).json({
		status: 'success',
		results: contacts.length,
		data: contacts
	})
})

//-------------------------------------------------------------------------------------------
const getContact = catchAsyncError(async (req, res, next) => {
	const contact = await Contact.findById(req.params.id)

	// check if not null to send global error to the handler
	if (!contact) return next(new AppError('No contact found with that ID', 404))

	res.status(201).json({
		status: 'success',
		result: 1,
		data: contact
	})
})
//-------------------------------------------------------------------------------------------
const updateContact = catchAsyncError(async (req, res, next) => {
	const updatedDoc = await Contact.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true // check Model to validate the changes
	})

	// check if not null to send global error to the handler
	if (!updatedDoc) return next(new AppError('No contact found with that ID', 404))

	res.status(200).json({
		status: 'success',
		data: updatedDoc
	})
})
//-------------------------------------------------------------------------------------------
const deleteContact = catchAsyncError(async (req, res, next) => {
	const contact = await Contact.findByIdAndRemove(req.params.id)

	// check if not null to send global error to the handler
	if (!contact) return next(new AppError('No contact found with that ID', 404))

	res.status(200).json({
		status: 'success',
		data: 'contact deleted'
	})
})
//-------------------------------------------------------------------------------------------

const addContact = catchAsyncError(async (req, res, next) => {
	const newContact = await Contact.create(req.body)
	res.status(201).json({
		status: 'success',
		data: {
			newContact_created: newContact
		}
	})
})
//-------------------------------------------------------------------------------------------

const getContactStats = catchAsyncError(async (req, res, next) => {
	const stats = await Contact.aggregate([
		{
			$match: { age: { $gte: 18 } }
		},
		{
			$group: {
				_id: { $toUpper: '$difficulty' },
				numContacts: { $sum: 1 },
				avgRating: { $avg: '$rating' },
				minAge: { $min: '$age' },
				maxAge: { $max: '$age' }
			}
		},
		{
			$sort: { minAge: -1 } // sort the results in ascending(1) or descending(-1) order
		},
		{
			$match: { _id: { $ne: 'EASY' } } // chain match the result for the second time (ne: "not equal")
		}
	])
	res.status(200).json({
		status: 'success',
		data: { stats }
	})
})

//-------------------------------------------------------------------------------------------

const getMonthlyCalls = catchAsyncError(async (req, res, next) => {
	let { year } = req.params
	year = parseInt(year, 10)
	const monthlyCalls = await Contact.aggregate([
		{
			$unwind: '$calls'
		},
		{
			$match: {
				// all the documents collections will match this
				calls: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`)
				}
			}
		},
		// {
		// 	$match: {
		// 		name: { $eq: 'Aghiles' }
		// 	}
		// },
		{
			$group: {
				_id: { $month: '$calls' },
				number_calls: { $sum: 1 },
				names: { $push: '$name' }
			}
		},
		{
			$addFields: { month: '$_id' }
		},
		{
			$project: { _id: 0 } // delete _id from the group to replace it with month
		},
		{
			$sort: { number_calls: -1 }
		},
		{
			$limit: 12 // limit the number of documents to get from the database
		}
	])
	res.status(200).json({
		status: 'success',
		data: { monthlyCalls }
	})
})

//-------------------------------------------------------------------------------------------
module.exports = {
	addContact,
	getAllContacts,
	getContact,
	deleteContact,
	updateContact,
	checkId,
	checkPostForm,
	aliasTopContacts,
	getContactStats,
	getMonthlyCalls
}
