const Contact = require('../models/contactModel')
//-------------------------------------------------------------------------------------------

// CONTROLLERS
const checkId = (req, res, next, val) => {
	next()
}
//-------------------------------------------------------------------------------------------
const checkPostForm = (req, res, next) => {
	next()
}

//-------------------------------------------------------------------------------------------
const getAllContacts = async (req, res) => {
	try {
		// 1- Filtering mongoDB methods that comes with req.query
		const reqQueryObject = { ...req.query }
		const excludedQueries = ['limit', 'page', 'sort', 'fields']
		excludedQueries.forEach((element) => delete reqQueryObject[element])

		// 2- Advanced Filtering mongoDB operators
		let reqQueryString = JSON.stringify(reqQueryObject)
		reqQueryString = reqQueryString.replace(/\b(gte|gt|lte|lt)\b/gi, (matchedString) => `$${matchedString}`)

		// 3- Query the MongoDB Database
		let query = Contact.find(JSON.parse(reqQueryString))

		// 4- Sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ')
			query = query.sort(sortBy)
		} else query = query.sort('-createdAt -rating')

		// 5- Limiting fields
		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' ')
			query = query.select(fields)
		}

		// 6- Pagination and limit content
		const page = parseInt(req.query.page, 10) || 1
		const limit = parseInt(req.query.limit, 10) || 20
		const skipValue = (page - 1) * limit
		query = query.skip(skipValue).limit(limit)
		if (req.query.page) {
			const ContactsLength = await Contact.countDocuments()
			if (skipValue >= ContactsLength) throw new Error('This page does not exist !') // throw will triger catch(err) immediately
		}

		const allContacts = await query // await for 1,2,3,4,5,6

		res.status(200).json({
			status: 'success',
			results: allContacts.length,
			data: allContacts
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
	Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
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

//-------------------------------------------------------------------------------------------
module.exports = {
	addContact,
	getAllContacts,
	getContact,
	deleteContact,
	updateContact,
	checkId,
	checkPostForm
}
