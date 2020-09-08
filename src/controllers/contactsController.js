const Contact = require('../models/contactModel')
const ApiFeatures = require('../utils/apiFeatures')
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
const getAllContacts = async (req, res) => {
	try {
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
	} catch (err) {
		res.status(400).json({
			status: 'failed',
			message: err
		})
	}
}
//-------------------------------------------------------------------------------------------
const getContact = async (req, res) => {
	try {
		const contact = await Contact.findById(req.params.id)

		res.status(201).json({
			status: 'success',
			result: 1,
			data: contact
		})
	} catch (err) {
		res.status(400).json({
			status: 'failed',
			message: err
		})
	}
}
//-------------------------------------------------------------------------------------------
const updateContact = (req, res) => {
	Contact.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true // check Model to validate the changes
	})
		.then((updatedDoc) => {
			return res.status(200).json({
				status: 'success',
				data: updatedDoc
			})
		})
		.catch((err) => {
			return res.status(400).json({
				status: 'failed',
				message: err
			})
		})
}
//-------------------------------------------------------------------------------------------
const deleteContact = async (req, res) => {
	await Contact.findByIdAndRemove(req.params.id)
	res.status(200).json({
		status: 'success',
		data: 'contact deleted'
	})
}
//-------------------------------------------------------------------------------------------
const addContact = async (req, res) => {
	try {
		const newContact = await Contact.create(req.body)
		res.status(201).json({
			status: 'success',
			data: {
				newContact_created: newContact
			}
		})
	} catch (err) {
		res.status(400).json({
			status: 'failed',
			message: err
		})
	}
}
const getContactStats = async (req, res) => {
	try {
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
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err
		})
	}
}
const getMonthlyCalls = async (req, res) => {
	try {
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
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err
		})
	}
}

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
