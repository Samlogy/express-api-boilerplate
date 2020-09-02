const express = require('express')
const contactController = require('../controllers/contactsController.js')
//-------------------------------------------------------------------------------------------
// declare scoped mini-router
const router = express.Router()

// special middleware that runs for the id
router.param('id', contactController.checkId) // middlware that only runs if we enter /:id route
// router.use(contactController.checkPostForm)  // we can use checkpostform here but it is better CHAINING middlewares inside POST

//-------------------------------------------------------------------------------------------

router
	.route('/')
	.get(contactController.getAllContacts)
	.post(contactController.checkPostForm, contactController.addContact)

router
	.route('/:id')
	.get(contactController.getContact)
	.patch(contactController.updateContact)
	.delete(contactController.deleteContact)
//-------------------------------------------------------------------------------------------

module.exports = router
