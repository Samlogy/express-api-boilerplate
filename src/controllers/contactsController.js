const fs = require('fs')
//-------------------------------------------------------------------------------------------
// fake databse
const contacts = JSON.parse(fs.readFileSync('db.json'))
//-------------------------------------------------------------------------------------------
// export functions
const checkId = (req, res, next, id) => {
	console.log(`the id is: ${id} \n checking if it's valid...`)
	if (id > contacts.length - 1 || id < 0)
		return res.status(404).json({ status: 'fail', message: 'invalid id' })
	next()
}
//-------------------------------------------------------------------------------------------
const checkPostForm = (req, res, next) => {
	const receivedDataLength = Object.keys(req.body).length
	const receivedData = req.body
	if (req.method === 'POST') {
		if (receivedDataLength > 0) {
			if (receivedData.firstName.length > 0 && receivedData.age.length > 0) {
				return next()
			} else {
				return res.status(400).json({
					status: 'failed',
					message: 'empty field detected'
				})
			}
		} else if (receivedDataLength == 0) {
			return res.status(400).json({
				status: 'failed',
				message: 'data not received on the server'
			})
		}
	}
	next()
}

//-------------------------------------------------------------------------------------------
const getAllContacts = (req, res) => {
	res.status(200).json({
		status: 'success',
		results: contacts.length,
		data: contacts
	})
}
//-------------------------------------------------------------------------------------------
const getContact = (req, res) => {
	console.log(req.params)
	const id = parseInt(req.params.id)

	res.status(201).json({
		status: 'success',
		result: 1,
		data: {
			contact: contacts[id]
		}
	})
}
//-------------------------------------------------------------------------------------------
const updateContact = (req, res) => {
	const id = parseInt(req.params.id)
	const firstName = req.body.firstName
	const age = req.body.age

	const contactsUpdated = contacts.map((contact) => {
		if (contact.id == id) {
			contact.firstName = firstName
			contact.age = age
		}
		return contact
	})

	fs.writeFile('./db.json', JSON.stringify(contactsUpdated), (err) => {
		if (err) res.status(404).send('error occured when updating')
		res.status(202).json({
			status: 'success',
			result: 1,
			data: {
				updatedContact: contacts.find((contact) => contact.id == id)
			}
		})
	})
}
//-------------------------------------------------------------------------------------------
const deleteContact = (req, res) => {
	const id = parseInt(req.params.id)

	const contactsUpdated = contacts.filter((contact) => contact.id != id)

	fs.writeFile('./db.json', JSON.stringify(contactsUpdated), (err) => {
		if (err) res.status(404).send('error occured when deleting')
		res.status(204).json({
			status: 'success',
			result: 1,
			data: {
				data: null
			}
		})
	})
}
//-------------------------------------------------------------------------------------------
const addContact = (req, res) => {
	const newId = parseInt(contacts[contacts.length - 1].id) + 1
	const newContact = {
		...req.body,
		id: newId
	}

	contacts.push(newContact)

	fs.writeFile('./db.json', JSON.stringify(contacts), (err) => {
		if (err) {
			console.log('problem happend when trying to update the file')
		} else {
			res.status(201).json({
				status: 'success',
				data: {
					contact: newContact
				}
			})
		}
	})
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
