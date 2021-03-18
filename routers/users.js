
const express = require('express')

const router = express.Router()
const checkAuthorization = require('../middleware/check-auth')
const checkValidation = require('../middleware/validationCheck')
const userController = require('../controllers/userController')

/**API for SignUp
 * @param  {*} '/signup' - Endpiont
 * @param  {*} checkValidation.signUpValidator - Validator
 * @param  {*} userController.signUp - Control Passed to controller
 */
router.post('/signup', checkValidation.signUpValidator, userController.signUp);

/**API for Login
 * @param  {*} '/login' - EndPoint
 * @param  {*} checkValidation.loginValidator -Validatior
 * @param  {*} userController.login - Control Passed to controller
 */
router.post('/login', checkValidation.loginValidator, userController.login);

/**API Get Whole User Info With Pagination
 * @param  {*} '/:from-:to' -EndPoint
 * @param  {*} checkAuthorization - Authentication Checker
 * @param  {*} userController.getAllUsersDetails - Control Passed to controller
 */
router.get('/:from-:to', checkAuthorization, userController.getAllUsersDetails);

/**API to provide or revoke Admin rights
 * @param  {*} '/controlAdmin'-EndPoint
 * @param  {*} checkAuthorization- Authentication Checker
 * @param  {*} checkValidation.controlAdminValidator- Validatior
 * @param  {*} userController.controlAdmin- Control Passed to controller
 */
router.patch('/controlAdmin', checkAuthorization, checkValidation.controlAdminValidator, userController.controlAdmin);

module.exports = router
