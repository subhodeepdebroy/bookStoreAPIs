/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const checkValid = require('../middleware/validationCheck')
const userController = require('../controllers/userController')



/**API for SignUp
 * @param  {*} '/signup' - Endpiont
 * @param  {*} checkValid.signUpValidator - Validator
 * @param  {*} userController.signUp - Control Passed to controller
 */
router.post('/signup', checkValid.signUpValidator, userController.signUp);

 
/**API for Login
 * @param  {*} '/login' - EndPoint
 * @param  {*} checkValid.loginValidator -Validatior
 * @param  {*} userController.login - Control Passed to controller
 */
router.post('/login', checkValid.loginValidator ,userController.login);


/**API Get Whole User Info With Pagination 
 * @param  {*} '/:from-:to' -EndPoint
 * @param  {*} checkAuth - Authentication Checker
 * @param  {*} userController.getAllUsersDetails - Control Passed to controller
 */
router.get('/:from-:to', checkAuth, userController.getAllUsersDetails);



/**API to provide or revoke Admin rights
 * @param  {*} '/controlAdmin'-EndPoint
 * @param  {*} checkAuth- Authentication Checker
 * @param  {*} checkValid.controlAdminValidator- Validatior
 * @param  {*} userController.controlAdmin- Control Passed to controller
 */
router.patch('/controlAdmin', checkAuth, checkValid.controlAdminValidator, userController.controlAdmin);




module.exports = router
