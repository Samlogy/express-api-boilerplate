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
	checkPostForm,
	aliasTopContacts
}
