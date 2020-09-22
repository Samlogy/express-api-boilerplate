const express = require('express')
const usersController = require('../controllers/usersController')
const authController = require('../controllers/authController')

const router = express.Router()

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)
router.route('/forgot-password').post(authController.forgotPassword)
router.route('/reset-password/:token').patch(authController.resetPassword)
router.route('/update-password').patch(authController.checkAccess, authController.updatePassword)

router.route('/:id').patch(authController.checkAccess, usersController.updateUser)

module.exports = router
