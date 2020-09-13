const express = require('express')
const contactController = require('../controllers/contactsController.js')
const authController = require('../controllers/authController')
//-------------------------------------------------------------------------------------------
// declare scoped mini-router
const router = express.Router()

// special middleware that runs for the id
router.param('id', contactController.checkId) // middlware that only runs if we enter /:id route

//-------------------------------------------------------------------------------------------

// ALIAS route for top 5 contacts with highest rating
router.route('/top-3-contacts').get(contactController.aliasTopContacts, contactController.getAllContacts)

// grouping, average, min, max
router.route('/contacts-stats').get(contactController.getContactStats)

// monthly calls per year (per user also (optional))
router.route('/monthly-calls/:year').get(contactController.getMonthlyCalls)

router.route('/').get(authController.checkAccess, contactController.getAllContacts).post(contactController.addContact) // chain middlwares by passing them one after the other

router
	.route('/:id')
	.get(contactController.getContact)
	.patch(contactController.updateContact)
	.delete(contactController.deleteContact)
//-------------------------------------------------------------------------------------------

module.exports = router
