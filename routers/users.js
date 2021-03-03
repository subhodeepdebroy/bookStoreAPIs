/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const checkValid = require('../middleware/validationCheck')
const userController = require('../controllers/userController')






/** API for SignUp*/ 

router.post('/signup', checkValid.signUpValidator, userController.signUp);

/**  API Login */

router.post('/login', checkValid.loginValidator ,userController.login);

/** API Get Whole User Info With Pagination */

router.get('/:from-:to', checkAuth, userController.getAllUsersDetails)

/**API to Provide or revoke Admin Rights */
 
router.patch('/controlAdmin', checkAuth, checkValid.controlAdminValidator, userController.controlAdmin);




module.exports = router
