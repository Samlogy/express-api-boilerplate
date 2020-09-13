const express = require('express')
const usersController = require('../controllers/usersController')
const authController = require('../controllers/authController')

const router = express.Router()

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)

router.route('/:id').patch(usersController.updateUser)

module.exports = router
